/* eslint-disable sort-imports */
import fs from 'fs/promises'
import {setFailed} from '@actions/core'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ReportGenerator from 'lighthouse/report/generator/report-generator'
import psi from 'psi'
import {createReportName} from './utils'

interface Options {
  url: string
  psiKey: string
}

export const generateReport = async ({url, psiKey}: Options): Promise<void> => {
  try {
    const {data} = await psi(url, {
      strategy: 'desktop',
      key: psiKey
    })

    const dir = './reports'
    const report = ReportGenerator.generateReportHtml(data.lighthouseResult)
    const reportName = `${dir}/${createReportName(url)}`

    await fs.mkdir(dir)
    await fs.writeFile(reportName, report, 'utf8')
  } catch (err) {
    setFailed(`Action failed with error ${err}`)
  }
}
