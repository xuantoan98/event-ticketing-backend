/**
 * @swagger
 * components:
 *  schemas:
 *    EventCategory:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Tên danh mục sự kiện
 *        description:
 *          type: string
 *          description: Mô tả danh mục sự kiện
 *        status:
 *          type: number
 *          enum: [0, 1]
 *          description: "Trạng thái của danh mục sự kiện (0: Inactive, 1: Active)"
 *    EventCategoryCreate:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Tên danh mục sự kiện
 *          required: true
 *        description:
 *          type: string
 *          description: Mô tả danh mục sự kiện
 *        status:
 *          type: number
 *          enum: [0, 1]
 *          description: "Trạng thái của danh mục sự kiện (0: Inactive, 1: Active)"
 */

/**
 * @swagger
 * /event-catogories:
 *  get:
 *    summary: Lấy danh sách danh mục sự kiện
 *    tags: [EventCategories]
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
 *        description: Danh sách danh mục sự kiện
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/EventCategory'
 */

/**
 * @swagger
 * /event-categories/{id}:
 *  get:
 *    summary: Lấy thông tin chi tiết danh mục
 *    tags: [EventCategories]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID của danh mục sự kiện
 *    responses:
 *      200:
 *        description: Thông tin danh mục sự kiện
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventCategory'
 *      400:
 *        description: Danh mục sự kiện không tồn tại
 */

/**
 * @swagger
 * /event-catogories:
 *  post:
 *    summary: Tạo mới danh mục sự kiện
 *    tags: [EventCategories]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EventCategory'
 *    responses:
 *      200:
 *        description: Tạo mới danh mục sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventCategory'
 *      400:
 *        description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /event-categories/{id}:
 *  put:
 *    summary: Cập nhật danh mục sự kiện
 *    tags: [EventCategories]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID danh mục sự kiện
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/EventCategory'
 *    responses:
 *      200:
 *        description: Cập nhật thông tin danh mục sự kiện thành công
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/EventCategory'
 *      400:
 *        description: Danh mục sự kiện không tồn tại
 */

/**
 * @swagger
 * /event-categoried/{id}:
 *  delete:
 *    summary: Xóa danh mục sự kiện
 *    tags: [EventCategories]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: ID danh mục sự kiện
 *    responses:
 *      200:
 *        description: Xóa danh mục sự kiện thành công
 *      400:
 *        description: Danh mục sự kiện không tồn tại
 */

import { Router } from "express";
import { eventCategoriesController } from "../controllers";
import { eventCategoriesValidator } from "../validators/EventCategories.validator";
import { authMiddleware } from "../middlewares";

const router = Router();

router.get('/', authMiddleware, eventCategoriesController.getAllEventCategories);
// router.get('/search', authMiddleware, eventCategoriesValidator('search'), eventCategoriesController.search);
router.get('/:id', eventCategoriesController.getDetailEventCategories);

router.post('/', authMiddleware, eventCategoriesValidator('create'), eventCategoriesController.createEventCategories);
router.put('/:id', authMiddleware, eventCategoriesValidator('update'), eventCategoriesController.updateEventCategories);
router.delete('/:id', authMiddleware, eventCategoriesController.deleteEventCategories);

export default router;
