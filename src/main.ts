import * as core from '@actions/core'
import {generateReport} from './lighthouse'

async function run(): Promise<void> {
  try {
    const url = core.getInput('url', {required: true})
    const psiKey = core.getInput('page-speed-insights-key', {
      required: true
    })

    await generateReport({url, psiKey})
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`)
  }
}

run()
