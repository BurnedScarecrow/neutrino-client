class ServerConfig {
  server: string
  server_port: string
  method: string
  password: string

  constructor(opts: { server: string; server_port: string; method: string; password: string }) {
    this.server = opts.server
    this.server_port = opts.server_port
    this.method = opts.method
    this.password = opts.password
  }
}

export default ServerConfig
