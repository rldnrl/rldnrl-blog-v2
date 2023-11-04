---
title: Serverless Next Component 배포 이슈
date: '2023-11-04'
tags: ['Deploy']
draft: false
summary: Next 13을 Serverless Next Component로 배포 실패하는 이유를 분석해봤습니다.
---

## 상황
```
> Build error occurred
Error: The "target" property is no longer supported in next.config.js.
See more info here https://nextjs.org/docs/messages/deprecated-target-config
...
```

다음과 같이 에러가 발생하면서 배포가 되지 않고 있었습니다.

## 빌드가 되는 시점으로
Git으로 버전 관리를 하고 있다면, 이전 시점으로 돌아갈 수 있습니다. 그래서 빌드되는 시점을 찾아서 들어갔습니다. 차이점은 다음과 같았습니다.

- 빌드가 되는 시점
  ```
  "next": "12.0.7",
  "react": "17.0.2",
  "react-dom": "17.0.2",
  ```

- 빌드가 안 되는 시점
  ```
  "next": "13.0.6",
  "react": "18.2.0",
  "react-dom": "18.2.0",
  ```

- Next.js 13에서 `next.config.js` 파일에서 `target`이 deprecated 되었는지 확인해봅시다.
  - [Next 13 Breaking Changes](https://nextjs.org/blog/next-13#breaking-changes)
    - The deprecated target option of `next.config.js` has been removed.

- Serverless Next Component에서 `target`을 사용하는지 확인해봅시다. ([코드 원본](https://github.com/serverless-nextjs/serverless-next.js/blob/4316b18794f053d7ed929b9342a649d6e0ab6f68/packages/libs/core/src/build/lib/createServerlessConfig.ts))
    ```ts
    import fs from "fs-extra";
    import path from "path";

    function getCustomData(importName: string, target: string): string {
      return `
    module.exports = function(...args) {
      let original = require('./${importName}');
      const finalConfig = {};
      const target = { target: '${target}' };
      if (typeof original === 'function' && original.constructor.name === 'AsyncFunction') {
        // AsyncFunctions will become promises
        original = original(...args);
      }
      if (original instanceof Promise) {
        // Special case for promises, as it's currently not supported
        // and will just error later on
        return original
          .then((originalConfig) => Object.assign(finalConfig, originalConfig))
          .then((config) => Object.assign(config, target));
      } else if (typeof original === 'function') {
        Object.assign(finalConfig, original(...args));
      } else if (typeof original === 'object') {
        Object.assign(finalConfig, original);
      }
      Object.assign(finalConfig, target);
      return finalConfig;
    }
      `.trim();
    }

    function getDefaultData(target: string): string {
      return `module.exports = { target: '${target}' };`;
    }

    type CreateServerlessConfigResult = {
      restoreUserConfig: () => Promise<void>;
    };

    export default async function createServerlessConfig(
      workPath: string,
      entryPath: string,
      useServerlessTraceTarget: boolean
    ): Promise<CreateServerlessConfigResult> {
      const target = useServerlessTraceTarget
        ? "experimental-serverless-trace"
        : "serverless";

      const primaryConfigPath = path.join(entryPath, "next.config.js");
      const secondaryConfigPath = path.join(workPath, "next.config.js");
      const backupConfigName = `next.config.original.${Date.now()}.js`;

      const hasPrimaryConfig = fs.existsSync(primaryConfigPath);
      const hasSecondaryConfig = fs.existsSync(secondaryConfigPath);

      let configPath: string;
      let backupConfigPath: string;

      if (hasPrimaryConfig) {
        // Prefer primary path
        configPath = primaryConfigPath;
        backupConfigPath = path.join(entryPath, backupConfigName);
      } else if (hasSecondaryConfig) {
        // Work with secondary path (some monorepo setups)
        configPath = secondaryConfigPath;
        backupConfigPath = path.join(workPath, backupConfigName);
      } else {
        // Default to primary path for creation
        configPath = primaryConfigPath;
        backupConfigPath = path.join(entryPath, backupConfigName);
      }

      const configPathExists = fs.existsSync(configPath);

      if (configPathExists) {
        await fs.rename(configPath, backupConfigPath);
        await fs.writeFile(configPath, getCustomData(backupConfigName, target));
      } else {
        await fs.writeFile(configPath, getDefaultData(target));
      }

      return {
        restoreUserConfig: async (): Promise<void> => {
          const needToRestoreUserConfig = configPathExists;
          await fs.remove(configPath);

          if (needToRestoreUserConfig) {
            await fs.rename(backupConfigPath, configPath);
          }
        }
      };
    }
    ```

  - 전부를 볼 필요는 없고 `target` 부분만 보면 됩니다. `useServerlessTraceTarget`이 `true`이면 `experimental-serverless-trace`이고 `serverless`를 세팅을 해주네요. 하지만 Next 13에서는 deprecated된 속성이기 때문에 사용하고 있어서 문제가 되었습니다.
  - Serverless Next Component에서는 Next.js 12에서 제공하는 기능을 지원을 안한다고 합니다.
    <img src="/static/images/serverless-next-feature.png" alt="serverless-next-feature" />
  
  ## 해결
  빌드가 되는 시점으로 Next.js 버전을 낮춥니다. 이를 계기로 팀에서는 Amplify로 바꾸게 되었습니다.