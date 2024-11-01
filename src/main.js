const core = require('@actions/core')
const tc = require('@actions/tool-cache')

function getDownloadURL(version, platform, arch) {
  // Construct the download URL
  // e.g. https://github.com/oras-project/oras/releases/download/v1.2.0/oras_1.2.0_linux_arm64.tar.gz
  return `https://github.com/oras-project/oras/releases/download/v${version}/oras_${version}_${platform}_${arch}.tar.gz`
}

function getVersion() {
  // Get the version of the tool to be installed
  const version = core.getInput('version')

  // Normalize the version to remove the 'v' prefix
  // e.g. v1.2.0 -> 1.2.0
  return version.replace('v', '')
}

function getArch() {
  // Get the architecture (x64, arm64)
  const arch = process.arch

  // Normalize the architecture to match the values in the download URL
  // e.g. x64 -> amd64
  switch (arch) {
    case 'x64':
      return 'amd64'
    case 'arm64':
      return 'arm64'
    default:
      throw new Error(`Unsupported architecture: ${arch}`)
  }
}

function getPlatform() {
  // Get the platform (darwin, linux, win32)
  const platform = process.platform

  // Normalize the platform to match the values in the download URL
  // e.g. darwin -> macos
  switch (platform) {
    case 'darwin':
      return 'darwin'
    case 'linux':
      return 'linux'
    case 'win32':
      return 'windows'
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}

async function setup() {
  const version = getVersion()
  const platform = getPlatform()
  const arch = getArch()

  // Download the specific version of the tool, e.g. as a tarball
  const pathToTarball = await tc.downloadTool(
    getDownloadURL(version, platform, arch)
  )

  // Extract the tarball onto the runner
  const pathToCLI = await tc.extractTar(pathToTarball)

  // Expose the tool by adding it to the PATH
  core.addPath(pathToCLI)
}

module.exports = {
  setup,
  getVersion,
  getPlatform,
  getArch,
  getDownloadURL
}
