/**
 * @swagger
 * components:
 *  schemas:
 *    EventInvite:
 *      type: object
 *      properties:
 *        inviteId:
 *          type: array
 *          schema:
 *            type: string
 *          description: Mã khách mời (ObjectID)
 *        eventId:
 *          type: string
 *          description: Mã sự kiện (ObjectID)
 *        note:
 *          type: string
 *          description: Ghi chú
 *        status:
 *          type: number
 *          enum: [0, 1]
 *          description: "Trạng thái khách mời sự kiện (0: Inactive, 1: Active)"
 */

/**
 * @swagger
 * /event-invite:
 *  get:
 *    summary: Danh sách khách mời sự kiện
 *    tags: [EventInvites]
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
 *        description: Lấy danh sách thông tin thành công
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/EventInvite'
 */

/**
 * @swagger
 * /event-invite/{id}:
 *  get:
 *    summary: Chi tiết khách mời sự kiện
 *    tags: [EventInvites]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID khách mời sự kiện
 *    responses:
 *      200:
 *        description: Lấy chi tiết khách mời sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventInvite'
 *      400:
 *        description: Khách mời sự kiện không tồn tại
 */

/**
 * @swagger
 * /event-invite:
 *  post:
 *    summary: Tạo mới khách mời sự kiện
 *    tags: [EventInvites]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EventInvite'
 *    responses:
 *      200:
 *        description: Tạo mới khách mời sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventInvite'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /event-invite/{id}:
 *  put:
 *    summary: Cập nhật khách mời sự kiện
 *    tags: [EventInvites]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID khách mời sự kiện
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EventInvite'
 *    responses:
 *      200:
 *        description: Cập nhật khách mời sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventInvite'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /event-invite/{id}:
 *  delete:
 *    summary: Xóa khách mời sự kiện
 *    tags: [EventInvites]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID khách mời sự kiện
 *    responses:
 *      200:
 *        description: Xóa khách mời sự kiện thành công
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

import { Router } from "express";
import { eventInviteController } from "../controllers";

const router = Router();

router.get('/', eventInviteController.getEventInvites);
router.get('/:id', eventInviteController.getEventInviteById);

router.post('/', eventInviteController.createEventInvite);
router.put('/:id', eventInviteController.updateEventInvite);
router.delete('/:id', eventInviteController.deleteEventInvite);

export default router;
