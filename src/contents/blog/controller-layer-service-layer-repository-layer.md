---
title: Controller, Service, Repository 계층 이해하기
date: '2024-07-20'
tags: ["Design Pattern"]
draft: false
summary: Controller, Service와 Repository 계층에 대해서 알아봅시다.
---

소프트웨어 아키텍쳐를 고민할 때, 많이 사용되는 용어라서 한 번 정리하고 넘어가는 게 좋을 것 같아서 정리해봤습니다. 이 글은 백엔드 기준으로 글을 작성한 것이고, 프론트엔드는 다른 글에서 작성해보겠습니다.

먼저 이 글을 읽기 위해서는 트랜잭션에 대한 이해가 필요합니다. 트랜잭션에 대해서 먼저 알아봅시다.

## 트랜잭션
트랜잭션(Transaction)은 데이터베이스에서 하나의 논리적인 작업 단위를 의미하며, 여러 데이터베이스 작업을 하나의 그룹으로 묶어 처리하는 것을 말합니다. 트랜잭션은 데이터의 일관성과 무결성을 보장하기 위해 다음과 같은 네 가지 중요한 특성을 지켜야합니다.

### ACID 특성
1. **Atomicity (원자성)**:
   트랜잭션의 모든 작업이 완전히 수행되거나 전혀 수행되지 않음을 보장합니다. 트랜잭션 중 일부 작업만 수행되고 실패하는 경우, 트랜잭션의 모든 작업은 롤백(취소)되어 데이터베이스 상태는 트랜잭션 이전 상태로 되돌아갑니다.

2. **Consistency (일관성)**:
   트랜잭션이 완료되면 데이터베이스가 일관된 상태로 유지됨을 보장합니다. 트랜잭션은 데이터베이스의 규칙(제약 조건, 트리거 등)을 위반하지 않도록 합니다.

3. **Isolation (고립성)**:
   여러 트랜잭션이 동시에 실행되더라도 각각의 트랜잭션은 독립적으로 실행되어야 합니다. 하나의 트랜잭션이 완료되기 전에는 다른 트랜잭션이 그 작업을 볼 수 없습니다.

4. **Durability (지속성)**:
   트랜잭션이 성공적으로 완료되면 그 결과는 영구적으로 데이터베이스에 반영됩니다. 시스템 장애가 발생하더라도 트랜잭션 결과는 손실되지 않습니다.

### 트랜잭션의 사용 예

다음은 트랜잭션을 사용하는 예입니다. 예를 들어, 은행 계좌 이체 시스템을 생각해 봅시다. 계좌 A에서 계좌 B로 금액을 이체하는 경우 두 가지 작업이 필요합니다:

1. 계좌 A의 잔액 감소
2. 계좌 B의 잔액 증가

이 두 작업은 하나의 트랜잭션으로 묶여야 합니다. 둘 중 하나라도 실패하면 전체 작업이 취소되어야 합니다. 이를 통해 데이터의 일관성을 유지할 수 있습니다.

### 예제
예제 코드는 Typescript와 SQLite3를 사용했습니다.

```typescript
import sqlite3 from "sqlite3";

class AccountTransactionExample {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database("/app/data/database.sqlite", (err) => {
      if (err) {
        console.error("Error opening database:", err.message);
      } else {
        this.db.run(`
          CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            balance REAL
          )
        `);
      }
    });
  }

  async transferFunds(
    fromAccountId: number,
    toAccountId: number,
    amount: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run("BEGIN TRANSACTION", (err) => {
        if (err) {
          return reject(err);
        }

        this.db.run(
          "UPDATE accounts SET balance = balance - ? WHERE id = ?",
          [amount, fromAccountId],
          (err) => {
            if (err) {
              return this.db.run("ROLLBACK", () => reject(err));
            }

            this.db.run(
              "UPDATE accounts SET balance = balance + ? WHERE id = ?",
              [amount, toAccountId],
              (err) => {
                if (err) {
                  return this.db.run("ROLLBACK", () => reject(err));
                }

                this.db.run("COMMIT", (err) => {
                  if (err) {
                    return reject(err);
                  }
                  resolve();
                });
              }
            );
          }
        );
      });
    });
  }
}

const accountTransactionExample = new AccountTransactionExample();

// 예제 사용
accountTransactionExample.transferFunds(1, 2, 100)
  .then(() => console.log('Funds transferred successfully'))
  .catch((err) => console.error('Failed to transfer funds:', err.message));
```

### 예제 설명

- **트랜잭션 시작**: `BEGIN TRANSACTION` 명령어를 사용하여 트랜잭션을 시작합니다.
- **업데이트 작업**: 계좌 A의 잔액을 감소시키고, 계좌 B의 잔액을 증가시킵니다. 각 작업은 개별적으로 실행되며, 하나의 작업이 실패하면 `ROLLBACK`을 실행하여 트랜잭션을 취소합니다.
- **트랜잭션 커밋**: 모든 작업이 성공적으로 완료되면 `COMMIT` 명령어를 사용하여 트랜잭션을 커밋합니다.

트랜잭션을 사용하여 데이터베이스 작업의 원자성을 보장하고, 데이터 무결성과 일관성을 유지할 수 있습니다. 트랜잭션은 특히 여러 개의 관련 작업이 모두 성공하거나 모두 실패해야 하는 상황에서 유용합니다.

이제 본격적으로 Controller, Service, Repository 계층에 대해서 이야기 해보겠습니다.

## Controller, Service, Repository 계층의 필요성
애플리케이션을 개발할 때, 유지보수성과 확장성을 위해 코드를 구조화하는 것이 중요합니다. 일반적인 아키텍처 패턴은 애플리케이션을 Controller, Service, Repository라는 계층으로 나누는 것입니다. 각 계층은 특정한 역할을 맡아 코드베이스를 효율적으로 조직하는 데 도움을 줍니다.

## 각 계층의 역할
### 1. 컨트롤러 계층 (Controller Layer)
컨트롤러 계층은 들어오는 HTTP 요청을 처리하고 클라이언트에게 응답을 반환하는 역할을 합니다. 클라이언트와 서버 간의 인터페이스 역할을 하며, 사용자의 요청을 해석하고 적절한 서비스로 전달합니다.

주요 역할:
- 클라이언트 요청 수신 및 처리:
  - 클라이언트로부터의 HTTP 요청을 수신하고, 요청 파라미터, 바디 등을 해석합니다.
  - 요청의 유형(GET, POST, PUT, DELETE 등)에 따라 다른 로직을 실행합니다.

- 적절한 서비스 메소드 호출:
  - 서비스 계층의 메소드를 호출하여 비즈니스 로직을 처리합니다.
  - 데이터 유효성 검사 등을 수행하고, 서비스 계층에 전달할 데이터 구조를 준비합니다.

- 클라이언트에게 응답 반환:
  - 서비스 계층에서 처리된 결과를 받아 클라이언트에게 반환합니다.
  - 성공적인 응답 또는 오류 메시지를 적절한 HTTP 상태 코드와 함께 전송합니다.

### 컨트롤러 계층 예제

```typescript
import { Request, Response } from "express";
import TodoService from "./todo.service";
import { isArray, isNumber, isString } from "lodash";
import { Todo } from "./todo.model";

class TodoController {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  async getAllTodos(req: Request, res: Response) {
    try {
      const todos = await this.todoService.getAllTodos();
      return res.json(todos);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }

  async createTodo(req: Request, res: Response) {
    const { title, description } = req.body;

    if (!title || !isString(title)) {
      return res
        .status(400)
        .json({ error: 'Invalid or missing "title" parameter' });
    }

    if (!description || !isString(description)) {
      return res
        .status(400)
        .json({ error: 'Invalid or missing "description" parameter' });
    }

    try {
      const newTodo = await this.todoService.createTodo(req.body);
      res.status(201).json(newTodo);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
    }
  }

  async updateTodoStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !isNumber(+id)) {
      res.status(400).json({ error: 'Invalid or missing "id" parameter' });
    }

    const statuses: Todo["status"][] = ["todo", "progress", "done"];

    if (!status || !statuses.includes(status)) {
      return res
        .status(400)
        .json({ error: 'Invalid or missing "status" parameter' });
    }

    try {
      const updatedTodo = await this.todoService.updateTodoStatus(+id, status);
      res.json(updatedTodo);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      }
    }
      }

  async updateMultipleTodoStatuses(req: Request, res: Response) {
    const updates = req.body;

    if (
      !isArray(updates) ||
      updates.some(
        (update) =>
          !update.id || !["todo", "progress", "done"].includes(update.status)
      )
    ) {
      return res.status(400).json({ error: "Invalid input" });
    }

    try {
      await this.todoService.updateMultipleTodoStatuses(updates);
      res.status(200).json({ message: "Todos updated successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
}

export default TodoController;
```

### 2. 서비스 계층 (Service Layer)
서비스 계층은 애플리케이션의 비즈니스 로직을 포함하고 데이터를 처리합니다. 서비스 계층은 클라이언트의 요청을 처리하기 위해 리포지토리 계층과 상호작용하며, 비즈니스 규칙을 적용합니다.

주요 역할:
- 비즈니스 로직 및 계산 처리:
  - 클라이언트의 요청을 처리하면서 비즈니스 로직을 적용합니다. 예를 들어, 데이터 유효성 검사, 계산, 데이터 변환 등을 수행합니다.
  - 복잡한 비즈니스 규칙을 구현하여 데이터 처리 흐름을 제어합니다.

- 트랜잭션 관리:
  - 여러 리포지토리 메소드를 호출할 때, 데이터의 일관성을 보장하기 위해 트랜잭션을 관리합니다.
  - 예를 들어, 여러 데이터베이스 작업을 하나의 트랜잭션으로 묶어, 하나라도 실패할 경우 전체 작업을 롤백할 수 있도록 합니다.

- 여러 리포지토리와 상호 작용:
  - 필요에 따라 여러 리포지토리의 데이터를 조합하거나 연산하여 클라이언트에게 필요한 결과를 생성합니다.
  - 데이터를 가져오거나 저장할 때, 리포지토리 계층과 상호작용합니다.

### 서비스 계층 예제

```typescript
import TodoRepository from "./todo.repository";
import { Todo } from "./todo.model";
import TransactionManager from "./transaction.manager";

class TodoService {
  private todoRepository: TodoRepository;
  private transactionManager: TransactionManager;

  constructor() {
    this.todoRepository = new TodoRepository();
    this.transactionManager = new TransactionManager(this.todoRepository.getDb());
  }

  async getAllTodos() {
    return this.todoRepository.getAllTodos();
  }

  async createTodo(todoData: Omit<Todo, "id">) {
    return this.todoRepository.createTodo({
      ...todoData,
      status: "todo",
    });
  }

  async updateTodoStatus(todoId: number, status: Todo["status"]) {
    return this.todoRepository.updateTodoStatus(todoId, status);
  }

  async updateMultipleTodoStatuses(
    updates: { id: number; status: Todo["status"] }[]
  ) {
    await this.transactionManager.beginTransaction();
    try {
      for (const { id, status } of updates) {
        await this.todoRepository.updateTodoStatus(id, status);
      }
      await this.transactionManager.commitTransaction();
    } catch (error) {
      await this.transactionManager.rollbackTransaction();
      throw error;
    }
  }
}

export default TodoService;
```

### 3. 리포지토리 계층 (Repository Layer)
리포지토리 계층은 데이터베이스 또는 데이터 소스와 직접 상호작용하여 데이터를 관리합니다. 데이터 저장소와의 CRUD(Create, Read, Update, Delete) 작업을 수행하며, 데이터 접근을 캡슐화합니다.

주요 역할:
- 데이터 접근 로직 캡슐화:
  - 데이터베이스와의 상호작용을 추상화하여 데이터 접근 로직을 캡슐화합니다.
  - SQL 쿼리나 ORM(Object Relational Mapping)과 같은 기술을 사용하여 데이터를 조회하거나 저장합니다.

- CRUD 작업 수행:
  - 데이터를 생성(Create), 조회(Read), 업데이트(Update), 삭제(Delete)하는 작업을 수행합니다.
  - 예를 들어, 특정 ID의 데이터를 가져오거나, 새로운 데이터를 저장하는 등의 작업을 처리합니다.

- 데이터 매핑:
  - 데이터베이스에서 가져온 데이터를 도메인 객체로 변환하거나, 도메인 객체를 데이터베이스 형식에 맞게 변환하여 저장합니다.
  - 객체 관계 매핑을 통해 데이터베이스와 도메인 모델 간의 변환을 처리합니다.

### 리포지토리 계층 예제

```typescript
import sqlite3 from "sqlite3";
import { Todo } from "./todo.model";

class TodoRepository {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database("/app/data/database.sqlite", (err) => {
      if (err) {
        console.error("Error opening database:", err.message);
      } else {
        this.db.run(`
          CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            status TEXT
          )
        `);
      }
    });
  }

  getDb() {
    return this.db;
  }

  async getAllTodos(): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      this.db.all<Todo>("SELECT * FROM todos", [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async createTodo(todoData: Omit<Todo, "id">): Promise<Todo> {
    return new Promise((resolve, reject) => {
      const { title, description, status } = todoData;
      const sql = "INSERT INTO todos (title, description, status) VALUES (?, ?, ?)";
      this.db.run(sql, [title, description, status], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, title, description, status });
        }
      });
    });
  }

  async updateTodoStatus(id: number, status: Todo["status"]): Promise<Todo> {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE todos SET status = ? WHERE id = ?";
      this.db.run(sql, [status, id], function (err) {
        if (err) {
          reject(err);
        } else {
          if (this.changes === 0) {
            reject(new Error(`Todo with id ${id} not found`));
          } else {
            resolve({ id, status } as Todo);
          }
        }
      });
    });
  }
}

export default TodoRepository;
```

### 트랜잭션 관리 클래스

트랜잭션을 관리하기 위한 클래스를 추가합니다.

```typescript
import sqlite3 from 'sqlite3';

class TransactionManager {
  private db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  beginTransaction(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('BEGIN TRANSACTION', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  commitTransaction(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('COMMIT', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  rollbackTransaction(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run('ROLLBACK', (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

export default TransactionManager;
```

이러한 계층을 분리하면 코드베이스가 모듈화되어 유지보수와 테스트가 용이해집니다. 각 계층은 자신의 역할에 집중함으로써 코드를 더 깔끔하고 체계적으로 관리할 수 있습니다.

## 정리
- Controller 계층: 클라이언트와의 인터페이스를 관리하며, 들어오는 요청을 처리하고 응답을 반환합니다.
- Service 계층: 비즈니스 로직을 처리하고 데이터를 조작하며, 트랜잭션을 관리합니다.
- Repository 계층: 데이터베이스와 직접 상호작용하여 데이터를 관리하고, CRUD 작업을 수행합니다.
- TransactionManager 클래스: 트랜잭션을 시작, 커밋, 롤백하는 역할을 담당하여 데이터베이스의 일관성과 무결성을 보장합니다.

이번 글에서는 소프트웨어 아키텍처에서 많이 사용되는 Controller, Service, Repository 계층에 대해 이해하고, 이를 실제로 구현해보았습니다. 각 계층은 서로 다른 책임을 가지고 있어 코드베이스의 유지보수성과 확장성을 높이는 데 도움을 줍니다. 특히, 트랜잭션 관리의 중요성과 이를 어떻게 구현하는지에 대해 살펴보았습니다.
<br />
이러한 계층을 분리하면 코드베이스가 모듈화되어 유지보수와 테스트가 용이해집니다. 각 계층은 자신의 역할에 집중함으로써 코드를 더 깔끔하고 체계적으로 관리할 수 있습니다.
