import Router from "koa-router";
import Compose from "koa-compose";
import Joi from "@hapi/joi";
import * as FocusController from 'S/Homepage/focusController';
import middle_compose from 'M/logger';

const focusRouter = new Router();

/**
 * 公用验证字段
 * Joi.date() 会将原 date 转换，不建议用
 */
const base_scheme = Joi.object({
    title: Joi.string().required(),
    details: Joi.string().allow(''),
    start_date: Joi.string().required(),
    end_date: Joi.string().allow(''),
    pictures: Joi.string().allow(''),
    priority: Joi.number().integer().required(),
    status: Joi.number().integer().required()
});

focusRouter.post('/add', async ctx => {
    let results = {
        success: true,
    };
    const params = await base_scheme.validateAsync(ctx.request.body);
    const res = await FocusController.addFocuxRecord(params);
    results['success'] = Array.isArray(res) && res.length > 0 ? true : false;
    ctx.body = results;

});

focusRouter.get('/list', async ctx => {
    const scheme = Joi.object({
        status: Joi.number().integer().default(-127)
    });
    let results = {
        success: true,
        data: {
            list: []
        },
    };
    const params = await scheme.validateAsync(ctx.request.query);
    const res = await FocusController.getFocusRecord(params);
    results['data']['list'] = res;
    ctx.body = results;
});

focusRouter.post('/update', async ctx => {
    const scheme = base_scheme.keys({
        id: Joi.number().integer().required()
    });
    let results = {
        success: true,
    };
    const params = await scheme.validateAsync(ctx.request.body);
    const res = await FocusController.updateFocusRecord(params);

    results['success'] = Array.isArray(res) && res.length > 0 ? true : false;
    ctx.body = results;
});

const router = new Router;
router.use('/service/focus', focusRouter.routes(), focusRouter.allowedMethods());

const router_routes = router.routes();
const router_allow_methods = router.allowedMethods();
const focusCompose = Compose([middle_compose, router_routes, router_allow_methods]);

export default focusCompose;
