/**
 * @swagger
 * components:
 *  schemas:
 *    EventCosts:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Tên chi phí
 *        price:
 *          type: number
 *          description: Giá bản ghi chi phí
 *        type:
 *          type: number
 *          enum: [0, 1]
 *          description: "Trạng thái thu chi phí sự kiện (0: Chi, 1: Thu)"
 *        note:
 *          type: string
 *          description: Ghi chú bản ghi chi phí
 *        quantity:
 *          type: number
 *          description: Số lượng bản ghi chi phí
 *        eventId:
 *          type: string
 *          description: ID sự kiện (ObjectID)
 */

/**
 * @swagger
 * /event-cost:
 *  get:
 *    summary: Danh sách chi phí
 *    tags: [EventCosts]
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
 *        description: Lấy danh sách chi phí thành công
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/EventCosts'
 */

/**
 * @swagger
 * /event-cost/{id}:
 *  get:
 *    summary: Chi tiết chi phí
 *    tags: [EventCosts]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID bản ghi chi phí sự kiện
 *    responses:
 *      200:
 *        description: Lấy thông tin bản ghi chi phí thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventCosts'
 *      400:
 *        description: Bản ghi chi phí không tồn tại
 */

/**
 * @swagger
 * /event-cost:
 *  post:
 *    summary: Tạo mới chi phí
 *    tags: [EventCosts]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EventCosts'
 *    responses:
 *      200:
 *        description: Tạo mới bản ghi thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventCosts'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /event-cost/{id}:
 *  put:
 *    summary: Cập nhật chi phí
 *    tags: [EventCosts]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID bản ghi chi phí sự kiện
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EventCosts'
 *    responses:
 *      200:
 *        description: Cập nhật bản ghi thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventCosts'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /event-cost/{id}:
 *  delete:
 *    summary: Xóa chi phí
 *    tags: [EventCosts]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID bản ghi chi phí sự kiện
 *    responses:
 *      200:
 *        description: Xóa bản ghi thành công
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

import { Router } from "express";
import { eventCostController } from "../controllers";
import { authMiddleware } from "../middlewares";
import { createEventCostValidator, updateEventCostValidator } from "../validators";

const router = Router();

router.get('/', authMiddleware, eventCostController.getEventCosts);
router.get('/:id', authMiddleware, eventCostController.getEventCosts);

router.post('/', authMiddleware, createEventCostValidator, eventCostController.createEventCost);
router.put('/:id', authMiddleware, updateEventCostValidator, eventCostController.updateEventCost);
router.delete('/:id', authMiddleware, eventCostController.deleteEventCost);

export default router;
