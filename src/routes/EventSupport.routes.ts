/**
 * @swagger
 * components:
 *  schemas:
 *    EventSupport:
 *      type: object
 *      properties:
 *        eventId:
 *          type: string
 *          description: Mã sự kiện
 *        userId:
 *          type: array
 *          items:
 *            type: string
 *            description: Mã user hỗ trợ
 *        responsible:
 *          type: string
 *          description: 
 *        isAccept:
 *          type: number
 *          enum: [0, 1]
 *          description: "Trạng thái chấp nhận hỗ trợ (0: Không chấp nhận, 1: Chấp nhận)"
 *        description:
 *          type: string
 *          description: Mô tả về công việc hỗ trợ
 *        note:
 *          type: string
 *          description: Ghi chú công việc
 */

/**
 * @swagger
 * /event-support:
 *  get:
 *    summary: Lấy danh sách người hỗ trợ sự kiện
 *    tags: [EventSupports]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *        description: Số trang
 *      - in: query
 *        name: limit
 *        schema: 
 *          type: integer
 *        description: Số lượng mỗi trang
 *      - in: query
 *        name: sortBy
 *        schema: 
 *          type: string
 *        description: Trường sắp xếp
 *      - in: query
 *        name: sortOrder
 *        schema: 
 *          type: string
 *          enum: [asc, desc]
 *        description: Thứ tự sắp xếp
 *      - in: query
 *        name: q
 *        schema:
 *          type: string
 *        description: Từ khóa tìm kiếm tên
 *    responses:
 *      200:
 *        description: Lấy danh sách thành công
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/EventSupport'
 */

/**
 * @swagger
 * /event-support/{id}:
 *  get:
 *    summary: Lấy thông tin người hỗ trợ sự kiện
 *    tags: [EventSupports]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID hỗ trợ sự kiện
 *    responses:
 *      200:
 *        description: Lấy thông tin hỗ trợ sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventSupport'
 *      400:
 *        description: Thông tin hỗ trợ sự kiện không tồn tại trong hệ thống
 */

/**
 * @swagger
 * /event-support:
 *  post:
 *    summary: Tạo mới người hỗ trợ sự kiện
 *    tags: [EventSupports]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EventSupport'
 *    responses:
 *      200:
 *        description: Tạo mới hỗ trợ sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventSupport'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /event-support/{id}:
 *  put:
 *    summary: Cập nhật người hỗ trợ sự kiện
 *    tags: [EventSupports]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID hỗ trợ sự kiện
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EventSupport'
 *    responses:
 *      200:
 *        description: Cập nhật thông tin người hỗ trợ sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventSupport'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /event-support/{id}:
 *  delete:
 *    summary: Xóa người hỗ trợ sự kiện
 *    tags: [EventSupports]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID hỗ trợ sự kiện
 *    responses:
 *      200:
 *        description: Xóa thông tin hỗ trợ sự kiện thành công
 *      400:
 *        description: Dữ liệu không tồn tại trong hệ thống
 */

import { Router } from "express";
import { eventSupportController } from "../controllers";
import { authMiddleware } from "../middlewares";
import { createEventSupportValidator, updateEventSupportValidator } from "../validators";

const router = Router();

router.get('/', authMiddleware, eventSupportController.getEventSupports);
router.get('/:id', authMiddleware, eventSupportController.getEventSupport);

router.post('/', authMiddleware, createEventSupportValidator, eventSupportController.createEventSupport);
router.put('/:id', authMiddleware, updateEventSupportValidator, eventSupportController.updateEventSupport);
router.delete('/:id', authMiddleware, eventSupportController.deleteEventSupport);

export default router;
