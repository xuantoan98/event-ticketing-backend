export enum DepartmentMessages {
  CREATE_SUCCESSFULLY = 'Tạo mới phòng ban thành công',
  UPDATE_SUCCESSFULLY = 'Cập nhật thông tin phòng ban thành công',
  DELETE_SUCCESSFULLY = 'Xóa phòng ban thành công',
  NOT_FOUND = 'Phòng ban không tồn tại trong hệ thống',
  GET_ALL_DEPARTMENTS = 'Lấy danh sách phòng ban thành công',
  SEARCH_DEPARTMENT = 'Tìm kiếm phòng ban thành công',
  GET_DETAIL_DEPARTMENT = 'Lấy thông tin phòng ban thành công',
  DEPARTMENT_EXITS = 'Phòng ban đã tồn tại trong hệ thống'
}

export enum UserMessages {
  REGISTER_SUCCESSFULLY = 'Đăng ký tài khoản thành công',
  LOGIN_SUCCESSFULLY = 'Đăng nhập thành công',
  AUTH_ERROR = 'Unauthorized',
  GET_CURRENT_USER_SUCCESSFULLY = 'Lấy thông tin người dùng thành công',
  ALLOW_FIELDS_NAME_OR_PASSS_UPDATE = 'Chỉ được cập nhật name hoặc password',
  UPDATE_SUCCESSFULLY = 'Cập nhật thông tin người dùng thành công',
  USER_NOT_FOUND = 'Người dùng không tồn tại',
  USER_UPDATE_STATUS_SUCCESSFULLY = 'Cập nhật trạng thái người dùng thành công',
  GET_USERS_SUCCESSFULLY = 'Lấy danh sách người dùng thành công',
  SEARCH_USER_SUCCESSFULLY = 'Tìm kiếm người dùng thành công',
  USER_CHOOSE_AVT = 'Vui lòng chọn ảnh đại diện',
  USER_UPDATE_AVT_SUCCESSFULLY = 'Cập nhật ảnh đại diện thành công',
  PASSWORD_INCORRECT = 'Mật khẩu cũ không chính xác',
  UPDATE_PASSWORD_SUCCESSFULLY = 'Cập nhật mật khẩu thành công. Vui lòng đăng nhập lại'
}

export enum EventCategoriesMessages {
  GET_ALL_EVENT_CATEGORY_SUCCESSFULLY = 'Lấy danh sách danh mục sự kiện thành công',
  SEARCH_EVENT_CATEGORY_SUCCESSFULLY = 'Tìm kiếm danh mục sự kiện thành công',
  GET_DETAIL_EVENT_CATEGORY_SUCCESSFULLY = 'Lấy chi tiết danh mục sự kiện thành công',
  NOT_FOUND = 'Không tìm thấy danh mục sự kiện',
  EVENT_CATEGORY_EXIT = 'Danh mục sự kiện đã tồn tại trong hệ thống',
  CREATED = 'Tạo mới danh mục sự kiện thành công',
  UPDATED = 'Cập nhật danh mục sự kiện thành công',
  DELETED = 'Xóa danh mục sự kiện thành công'
}

export enum AuthMessages {
  FORBIDDEN = 'Forbidden'
}

export enum EventMessages {
  CREATED = 'Thêm mới sự kiện thành công',
  NOT_FOUND = 'Không tìm thấy sự kiện',
  UPDATED = 'Cập nhật thông tin sự kiện thành công',
  ID_NOT_VALID = 'ID sự kiện không hợp lệ',
  GET_DETAIL_EVENT_SUCCESSFULLY = 'Lấy chi tiết thông tin sự kiện thành công',
  GET_ALL_EVENT_SUCCESSFULLY = 'Lấy danh sách sự kiện thành công',
  CANCELL_EVENT_SUCCESSFULLY = 'Đổi trạng thái sự kiện thành công',
  ARRAY_ID_CATEGORIES_INVALID = 'Danh sách ID danh mục không hợp lệ'
}

export enum InviteMessages {
  CREATE_SUCCESSFULLY = 'Tạo mới thông tin khách mời thành công',
  UPDATE_SUCCESSFULLY = 'Cập nhật thông tin khách mời thành công',
  DELETE_SUCCESSFULLY = 'Xóa thông tin khách hàng thành công',
  NOT_FOUND = 'Thông tin khách mời không tồn tại trong hệ thống',
  GET_ALL_INVITES = 'Lấy danh sách khách mời thành công',
  SEARCH_INVITE = 'Tìm kiếm Khách mời thành công',
  GET_DETAIL_INVITE = 'Lấy thông tin khách mời thành công',
  INVITE_EXITS = 'Khách mời đã tồn tại trong hệ thống'
}
