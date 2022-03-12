/* eslint-disable sort-imports */
import fs from 'fs/promises'
import {setFailed} from '@actions/core'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ReportGenerator from 'lighthouse/report/generator/report-generator'
import psi from 'psi'
import {createReportName} from './utils'
import {generateSlackMessage} from './slack'
import * as core from '@actions/core'

interface Options {
  url: string
  psiKey: string
  reportPrefix: string
}

export const generateReport = async ({
  url,
  psiKey,
  reportPrefix
}: Options): Promise<Object | undefined> => {
  core.info(`🚀 ~ file: lighthouse.ts ~ line 23 ~ url, ${url}`)
  core.info(
    `🚀 ~ file: lighthouse.ts ~ line 23 ~ reportPrefix, ${reportPrefix}`
  )

  try {
    const {data} = await psi(url, {
      strategy: 'desktop',
      key: psiKey
    })

    const dir = './reports'
    const report = ReportGenerator.generateReportHtml(data.lighthouseResult)
    const filename = createReportName(url)
    const reportName = `${dir}/${filename}`

    const hostedFileUrl = `${normalisePrefix(reportPrefix)}/${filename}`

    try {
      await fs.mkdir(dir)
    } catch {
      // eslint-disable-next-line no-console
      console.log(`${dir} exists`)
    }

    await fs.writeFile(reportName, report, 'utf8')

    return generateSlackMessage(data, hostedFileUrl)
  } catch (err) {
    setFailed(`Action failed with error ${err}`)
  }
}

const normalisePrefix = (str: string): string => {
  return str.endsWith('/') ? str.substr(0, str.length - 1) : str
}
