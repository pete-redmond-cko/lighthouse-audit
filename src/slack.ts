import {format} from 'date-fns'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateSlackMessage = (data: any, reportUrl: string): Object => {
  return {
    text: createTextDescription({
      data,
      url: reportUrl
    }),
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Lighthouse report',
          emoji: true
        }
      },
      createDivider(),
      createSection([
        {
          title: 'Url',
          value: `<${data.lighthouseResult.requestedUrl}|data.lighthouseResult.requestedUrl}>`
        },
        {
          title: 'Timestamp',
          value: format(
            new Date(data.lighthouseResult.fetchTime),
            'HH:mm dd/MM/yyyy'
          )
        }
      ]),
      createDivider(),
      createSection([
        {
          title: data.lighthouseResult.categories.performance.title,
          value: `${getEmoji(
            data.lighthouseResult.categories.performance.score
          )} \`${data.lighthouseResult.categories.performance * 100}\``
        }
      ]),
      createSection([
        formatMetrics(data.lighthouseResult.audits['first-contentful-paint']),
        formatMetrics(data.lighthouseResult.audits['interactive'])
      ]),
      createSection([
        formatMetrics(data.lighthouseResult.audits['speed-index']),
        formatMetrics(data.lighthouseResult.audits['total-blocking-time'])
      ]),
      createSection([
        formatMetrics(data.lighthouseResult.audits['largest-contentful-paint']),
        formatMetrics(data.lighthouseResult.audits['cumulative-layout-shift'])
      ]),
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `<${reportUrl}|View full report>`
          }
        ]
      }
    ]
  }
}

const createDivider = (): Object => {
  return {
    type: 'divider'
  }
}

interface Field {
  title: string
  value: string
}

const createSection = (fields: Field[]): Object => {
  return {
    type: 'section',
    fields: mapFields(fields)
  }
}

const mapFields = (fields: Field[]): Object[] => {
  return fields.map(mapField)
}

const mapField = (field: Field): Object => {
  return {
    type: 'mrkdwn',
    text: `*${field.title}*\n${field.value}`
  }
}

interface Metric {
  title: string
  score: number
  displayValue: string
}

const formatMetrics = (metric: Metric): Field => {
  return {
    title: metric.title,
    value: `${getEmoji(metric.score)} \`${metric.displayValue}\``
  }
}

const getEmoji = (score: number): string => {
  let emoji = ':large_green_circle:'

  if (score < 0.5) {
    emoji = ':red_circle:'
  } else if (score < 0.9) {
    emoji = ':large_orange_circle:'
  }

  return emoji
}

// const addProtocol = (str: string): string => {
//   return `https://${str}`
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTextDescription = ({data, url}: any): string => {
  return `Lighthouse report for ${url}. Performance: ${data.lighthouseResult.categories.performance.score}`
}
