/**
 * @swagger
 * components:
 *  schemas:
 *    EventDetail:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Tên chi tiết sự kiện
 *        description:
 *          type: string
 *          description: Mô tả chi tiết sự kiện
 *        startAt:
 *          type: number
 *          description: Thời gian bắt đầu
 *        endAt:
 *          type: number
 *          description: Thời gian kết thúc
 *        status:
 *          type: number
 *          enum: [0, 1]
 *          description: "Trạng thái chi tiết sự kiện (0: Inactive, 1: Active)"
 */

/**
 * @swagger
 * /event-detail:
 *  get:
 *    summary: Danh sách chi tiết sự kiện
 *    tags: [EventDetails]
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
 *        description: Từ khóa tìm kiếm tên/email
 *    responses:
 *        200:
 *          description: Lấy danh sách chi tiết sự kiện thành công
 *          content: 
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/EventDetail'
 */

/**
 * @swagger
 * /event-detail/{id}:
 *  get:
 *    summary: Chi tiết sự kiện
 *    tags: [EventDetails]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID chỉ tiết sự kiện
 *    responses:
 *      200:
 *        description: Lấy chi tiết thông tin sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EvetnDetail'
 * 
 *      400:
 *        description: Chi tiết sự kiện không tồn tại
 */

/**
 * @swagger
 * /event-detail:
 *  post:
 *    summary: Thêm mới chi tiết sự kiện
 *    tags: [EventDetails]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EvetnDetail'
 *    responses:
 *      200:
 *        description: Tạo mới chi tiết sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EvetnDetail'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /event-detail/{id}:
 *  put:
 *    summary: Cập nhật chi tiết sự kiện
 *    tags: [EventDetails]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID chỉ tiết sự kiện
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EvetnDetail'
 *    responses:
 *      200:
 *        description: cập nhật chi tiết sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EvetnDetail'
 *      400:
 *        description: Chi tiết sự kiện không tồn tại
 */

/**
 * @swagger
 * /event-detail/{id}:
 *  delete:
 *    summary: Xóa chi tiết sự kiện
 *    tags: [EventDetails]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID chỉ tiết sự kiện
 *    responses:
 *      200:
 *        description: Xóa chi tiết sự kiện thành công
 *      400:
 *        description: Chi tiết sự kiện không tồn tại
 */

import { Router } from "express";
import { eventDetailController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = Router();

router.get('/', authMiddleware, eventDetailController.getEventDetails);
router.get('/:id', authMiddleware, eventDetailController.getEventDetail);

router.post('/', authMiddleware, eventDetailController.createEventDetail);
router.put('/:id', authMiddleware, eventDetailController.updateEventDetail);
router.delete('/:id', authMiddleware, eventDetailController.deleteEventDetail);

export default router;
