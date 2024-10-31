const core = require('@actions/core')
const tc = require('@actions/tool-cache')
const main = require('../src/main')

// Mock the GitHub Actions core library
jest.mock('@actions/core')
jest.mock('@actions/tool-cache')

describe('ORAS setup action', () => {
  const originalPlatform = process.platform
  const originalArch = process.arch

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset platform/arch getters
    Object.defineProperty(process, 'platform', {
      value: originalPlatform
    })
    Object.defineProperty(process, 'arch', {
      value: originalArch
    })
  })

  describe('getVersion', () => {
    it('normalizes version with v prefix', () => {
      core.getInput.mockReturnValue('v1.2.3')
      expect(main.getVersion()).toBe('1.2.3')
    })

    it('returns version without v prefix as is', () => {
      core.getInput.mockReturnValue('1.2.3')
      expect(main.getVersion()).toBe('1.2.3')
    })
  })

  describe('getArch', () => {
    it('maps x64 to amd64', () => {
      Object.defineProperty(process, 'arch', {
        value: 'x64'
      })
      expect(main.getArch()).toBe('amd64')
    })

    it('maps arm64 to arm64', () => {
      Object.defineProperty(process, 'arch', {
        value: 'arm64'
      })
      expect(main.getArch()).toBe('arm64')
    })

    it('throws error for unsupported architecture', () => {
      Object.defineProperty(process, 'arch', {
        value: 'ia32'
      })
      expect(() => main.getArch()).toThrow('Unsupported architecture: ia32')
    })
  })

  describe('getPlatform', () => {
    it('returns darwin for darwin', () => {
      Object.defineProperty(process, 'platform', {
        value: 'darwin'
      })
      expect(main.getPlatform()).toBe('darwin')
    })

    it('returns linux for linux', () => {
      Object.defineProperty(process, 'platform', {
        value: 'linux'
      })
      expect(main.getPlatform()).toBe('linux')
    })

    it('returns windows for win32', () => {
      Object.defineProperty(process, 'platform', {
        value: 'win32'
      })
      expect(main.getPlatform()).toBe('windows')
    })

    it('throws error for unsupported platform', () => {
      Object.defineProperty(process, 'platform', {
        value: 'freebsd'
      })
      expect(() => main.getPlatform()).toThrow('Unsupported platform: freebsd')
    })
  })

  describe('getDownloadURL', () => {
    it('constructs correct download URL', () => {
      const url = main.getDownloadURL('1.2.3', 'linux', 'amd64')
      expect(url).toBe(
        'https://github.com/oras-project/oras/releases/download/v1.2.3/oras_1.2.3_linux_amd64.tar.gz'
      )
    })
  })

  describe('setup', () => {
    beforeEach(() => {
      // Mock successful download and extraction
      tc.downloadTool.mockResolvedValue('/path/to/download')
      tc.extractTar.mockResolvedValue('/path/to/cli')
      core.getInput.mockReturnValue('1.2.3')
    })

    it('downloads and extracts CLI successfully', async () => {
      await main.setup()

      // Verify extraction
      expect(tc.extractTar).toHaveBeenCalledWith('/path/to/download')

      // Verify PATH addition
      expect(core.addPath).toHaveBeenCalledWith('/path/to/cli')
    })

    it('handles download failure', async () => {
      tc.downloadTool.mockRejectedValue(new Error('Download failed'))

      await expect(main.setup()).rejects.toThrow('Download failed')
    })

    it('handles extraction failure', async () => {
      tc.extractTar.mockRejectedValue(new Error('Extraction failed'))

      await expect(main.setup()).rejects.toThrow('Extraction failed')
    })
  })
})
