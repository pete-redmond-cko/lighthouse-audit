import * as core from '@actions/core'
import {generateReport} from './lighthouse'

async function run(): Promise<void> {
  try {
    const {url, psiKey, reportPrefix} = getInputs()

    core.info('before')
    core.info(url)
    core.info(addProtocol(url))
    core.info('after')

    const messagePayload = await generateReport({
      url: addProtocol(url),
      psiKey,
      reportPrefix: addProtocol(reportPrefix)
    })

    core.setOutput(
      'slack-message-payload',
      JSON.stringify(messagePayload, null, 2)
    )
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`)
  }
}

const getInputs = (): {url: string; psiKey: string; reportPrefix: string} => {
  const url = core.getInput('url', {required: true})
  const psiKey = core.getInput('page-speed-insights-key', {
    required: true
  })
  const reportPrefix = core.getInput('report-prefix', {
    required: true
  })

  return {url, psiKey, reportPrefix}
}

const addProtocol = (str: string): string => {
  return `https://${str}`
}

run()
