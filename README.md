# Setup ORAS CLI for GitHub Actions

Use this action to install the [ORAS CLI](https://oras.land/) in your GitHub Actions workflow.

## Usage

To use this action in your workflow, add the following step:

```yaml
- name: Setup ORAS
  uses: balena-io-experimental/setup-oras-action@main
  with:
    version: 1.2.0
```

### Inputs

- `version`: The ORAS CLI release to install. See available releases [here](https://github.com/oras-project/oras/releases).

### Outputs

- `version`: The ORAS CLI release that was installed.

## Contributing

Contributions to improve the action are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to your branch
5. Create a new Pull Request

Please make sure to update tests as appropriate and adhere to the existing
coding style.

## License

This project is licensed under Apache 2.0 - see the [LICENSE](LICENSE) file for
details.

## Support

If you encounter any problems or have any questions, please open an issue in the
GitHub repository.
