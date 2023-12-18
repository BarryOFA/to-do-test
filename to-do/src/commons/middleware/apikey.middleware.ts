import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class ApikeyMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.apikey !== this.configService.get('API_KEY')) {
      return res.status(403).json({
        trace: req.header('trace'),
        message: 'Invalid API Key',
        code: 403,
      })
    } else next()
  }
}
