"use client"

import { useCallback, useEffect, useState } from "react"
import { siteMetadata } from "@/constant/site-metadata"
import axios from "axios"
import { useTheme } from "next-themes"
import {
  Activity,
  default as ReactGithubCalendar,
} from "react-activity-calendar"

import { Skeleton } from "./ui/skeleton"

const API_URL = "https://github-contributions-api.jogruber.de/v4/"

const fetchCalendarData = async (username: string, year: string) => {
  try {
    const response = await axios.get(`${API_URL}${username}`, {
      params: {
        y: year,
      },
    })

    return response.data
  } catch (e: any) {
    throw new Error(e)
  }
}

export const GithubCalendar = () => {
  const { theme } = useTheme()

  const [data, setData] = useState<Array<Activity> | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchData = useCallback(() => {
    setLoading(true)
    fetchCalendarData(siteMetadata.github.username, "last")
      .then(({ contributions }) => setData(contributions))

      .finally(() => setLoading(false))
  }, [])

  useEffect(fetchData, [fetchData])

  if (loading || !data) {
    return <Skeleton className="h-[100px] w-[650px]" />
  }

  return (
    <ReactGithubCalendar
      data={data}
      loading={loading}
      colorScheme={theme === "dark" ? "dark" : "light"}
      labels={{
        legend: {
          less: "Less",
          more: "More",
        },
        months: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        totalCount: "{{count}} activities in {{year}}",
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      }}
      theme={{
        light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
        dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
      }}
    />
  )
}
