/**
 * @swagger
 * components:
 *  schemas:
 *    EventInvite:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Tên khách mời
 *        email:
 *          type: string
 *          format: email
 *          description: Email khách mời
 *        phone:
 *          type: string
 *          description: Số điện thoại khách mời
 *        fax:
 *          type: string
 *          description: Số fax
 *        status:
 *          type: number
 *          enum: [0, 1]
 *          description: Trạng thái của khách mời
 *        createdBy:
 *          type: string
 *          description: ID của user tạo thông tin
 *        updatedBy:
 *          type: string
 *          description: ID của user cập nhật thông tin
 */

/**
 * @swagger
 * /event-invite:
 *  get:
 *    summary: Lấy danh sách khách mời
 *    tags: [EventInvites]
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
 *      200:
 *        description: Lấy danh sách khách mời thành công
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
 *    summary: Lấy chi tiết khách mời
 *    tags: [EventInvites]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID của khách mời
 *    responses:
 *      200:
 *        description: Lấy thông tin khách mời thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventInvite'
 *      400:
 *        description: Khách mời không tồn tại
 */

/**
 * @swagger
 * /event-invite:
 *  post:
 *    summary: Tạo mới thông tin khách mời
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
 *      201:
 *        description: Tạo mới khách mời thành công
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
 *    summary: Cập nhật thông tin khách mời
 *    tags: [EventInvites]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID của khách mời
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EventInvite'
 *    responses:
 *      200:
 *        description: Cập nhật thông tin khách mời thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventInvite'
 *      400:
 *        ddescription: Khách mời không tồn tại
 */

/**
 * @swagger
 * /event-invite/{id}:
 *  delete:
 *    summary: Xóa thông tin khách mời
 *    tags: [EventInvites]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID của khách mời
 *    responses:
 *      200:
 *        description: Xóa thông tin khách mời thành công
 *      400:
 *        ddescription: Khách mời không tồn tại
 */

import { Router } from "express";
import { inviteController } from "../controllers";
import { authMiddleware } from "../middlewares";

const router = Router();

router.get('/', authMiddleware, inviteController.getAllInvite);
// router.get('/search', authMiddleware, inviteController.search);
router.get('/:id', authMiddleware, inviteController.getDetailInvite);

router.post('/', authMiddleware, inviteController.createInvite);
router.put('/:id', authMiddleware, inviteController.updateInvite);
router.delete('/:id', authMiddleware, inviteController.deleteInvite);

export default router;
