import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

import { moment } from "../../utils/log";
import { ApiStatus } from '../../utils/constant';
import { ApiControllers } from '../controller/api-controller';

const apiControllers: ApiControllers = new ApiControllers();

const loginValidationRules = [
    body('phone').isString().notEmpty().withMessage('请输入手机号'),
    body('password').notEmpty().withMessage('请输入密码')
];

/**
 * 前置拦截路由中定义的参数验证逻辑, 并统一返回.
 *
 * @param request express request
 * @param response express response
 * @param next express NextFunction
 */
export const beforeValidatorRuleFilter = (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        moment.warn(`Parameter validation failed when request '${request.path}'.`, errors.array());
        return response.json({
            status: ApiStatus.INVALID_PARAMETER,
            message: errors.array()[0].msg,
            data: null
        });
    }

    next();
};

export class ApiRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.mountRouters();
    }

    mountRouters(): void {
        this.router.post('/auth/login', loginValidationRules, beforeValidatorRuleFilter, apiControllers.login);
    }
}
