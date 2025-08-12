/**
 * @swagger
 * components:
 *  schemas:
 *    Event:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          description: Ten su kien
 *        description:
 *          type: string
 *          description: Mo ta su kien
 *        startDate:
 *          type: string
 *          format: date-time
 *          description: Thoi gian bat dau
 *        endDate:
 *          type: string
 *          format: date-time
 *          description: Thoi gian ket thuc
 *        location:
 *          type: string
 *          description: Dia chi
 *        coverImage:
 *          type: string
 *          description: Anh su kien
 *        eventCategoriesId:
 *          type: array
 *          schema:
 *            type: string
 *          description: ID danh muc su kien
 *        isLimitSeat:
 *          type: number
 *          description: Giới hạn chỗ ngồi
 *        totalSeats:
 *          type: number
 *          description: Tổng số chỗ ngồi
 *        totalCustomerInvites:
 *          type: number
 *          description: Tổng số khách mời
 *        totalSupports:
 *          type: number
 *          description: Tổng số nhân viên hỗ trợ
 *        totalDetails:
 *          type: number
 *          description: Tổng số bản ghi mô tả sự kiện
 *        totalCosts:
 *          type: number
 *          description: Tổng số bản ghi chi phí sự kiện
 *        totalFeedbacks:
 *          type: number
 *          description: Tổng số phản hồi
 *        estimatePrice:
 *          type: number
 *          description: Chi phí dự kiến
 *        realPrice:
 *          type: number
 *          description: Chi phí thực tế
 */

/**
 * @swagger
 * /events:
 *  get:
 *    summary: Danh sách sự kiện
 *    tags: [Events]
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
 *        description: Lấy danh sách sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Event'  
 */

/**
 * @swagger
 * /events/{id}:
 *  get:
 *    summary: Chi tiết sự kiện
 *    tags: [Events]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID sự kiện
 *    responses:
 *      200:
 *        description: Lấy thông tin chi tiết sự kiện
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *      400:
 *        description: Sự kiện không tồn tại
 */

/**
 * @swagger
 * /events:
 *  post:
 *    summary: Tạo mới sự kiện
 *    tags: [Events]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Event'
 *    responses:
 *      200:
 *        description: Tạo mới sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /events/{id}:
 *  put:
 *    summary: Cập nhật sự kiện
 *    tags: [Events]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID sự kiện
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Event'
 *    responses:
 *      200:
 *        description: Cập nhật sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /events/event-by-categories:
 *  get:
 *    summary: Danh sách sự kiện theo danh mục
 *    tags: [Events]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: categoryIds
 *        required: true
 *        schema:
 *          type: string
 *          example: id1,id2,id3,...
 *    responses:
 *      200:
 *        description: Lấy danh sách sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Event'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /events/{id}/cancel:
 *  path:
 *    summary: Hủy sự kiện
 *    tags: [Events]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          example: "665f95ef8e04b2c7c3f1b0f9"
 *        description: ID sự kiện
 *    responses:
 *      200:
 *        description: Hủy sự kiện thành công
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

import { Router } from "express";
import { eventController } from "../controllers";
import { authMiddleware } from "../middlewares";
import { eventCreateValidator, updateEventValidator } from "../validators";

const router = Router();

router.get('/', authMiddleware, eventController.getAllEvents);
router.get('/my-events', authMiddleware, eventController.getMyEvents);
// router.get('/search', authMiddleware, searchEventValidator, eventController.searchEvents);
router.get('/:id', authMiddleware, eventController.getEventById);

router.post('/', authMiddleware, eventCreateValidator, eventController.createEvent);
router.put('/:id', authMiddleware, updateEventValidator, eventController.updateEvent);

router.get('/event-by-categories', authMiddleware, eventController.getEventCategories);
router.patch('/:id/cancel', authMiddleware, eventController.cancellEvent);

export default router;
