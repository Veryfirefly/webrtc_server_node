import { Request, Response } from 'express';
import { createHash } from 'crypto';
import { sign } from 'jsonwebtoken';

import { config } from '../../utils/config';
import { get } from '../../database/async-sqlite';
import { cache, defaultExpireTime, tokenKey, principalKey } from '../../utils/cache';
import { ApiStatus, ACCESS_TOKEN_KEY } from '../../utils/constant';

export class ApiControllers {

    async login(request: Request, response: Response): Promise<Response> {
        // we knew all parameters is string.
        const phone: string = request.body['phone'].toString();
        const password: string = request.body['password'].toString();

        const data: any = await get('select id, phone, password, avatar, name, create_time, modify_time from user where phone=?', phone);
        if (data) {
            const calculate: string = createHash('md5').update(password).digest('hex');
            const original: string = data['password'];
            if (original !== calculate) {
                return response.json({ status: ApiStatus.OK, message: '用户名或密码错误.', data: null });
            }

            const token: string = sign({ id: data['id'], phone: data['phone'] }, config.tokenSecretKey, { expiresIn: '30d' });

            // set principal and token to cache.
            cache.set(principalKey(data['phone']), data, defaultExpireTime);
            cache.set(tokenKey(data['phone']), token, defaultExpireTime);

            response.setHeader(ACCESS_TOKEN_KEY, token);

            return response.json({
                    status: ApiStatus.OK,
                    message: null,
                    data: {
                        id: data['id'],
                        phone: data['phone'],
                        avatar: data['avatar'],
                        name: data['name'],
                        create_time: data['create_time'],
                        modify_time: data['modify_time']
                    }
                });
        }

        // empty
        return response.json({ status: ApiStatus.OK, message: null, data: [] });
    }
}
