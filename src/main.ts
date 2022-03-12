import * as core from '@actions/core'
import {generateReport} from './lighthouse'

async function run(): Promise<void> {
  try {
    const {url, psiKey, reportPrefix} = getInputs()

    const messagePayload = await generateReport({
      url,
      psiKey,
      reportPrefix
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

run()
