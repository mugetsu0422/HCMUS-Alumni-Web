export const SALT = 15
export const EMAIL_ACTIVATION_CODE_TIMER = 59000 // 59s
export const JWT_COOKIE = 'jwt'
export const JWT_EXPIRED_TIME = 3 // 3 days
export const ADMIN_VERIFY_ALUMNI_PAGE_LIMIT = 10
export const ADMIN_NEWS_PAGE_LIMIT = 10
export const COMMENT_PAGE_SIZE = 50
export const CHILDREN_COMMENTS_PAGE_SIZE = 50
export const REACTION_PAGE_SIZE = 50
export const FACULTIES = [
  { id: '1', name: 'Công nghệ Thông tin' },
  { id: '2', name: 'Vật lý – Vật lý kỹ thuật' },
  { id: '3', name: 'Địa chất' },
  { id: '4', name: 'Toán – Tin học' },
  { id: '5', name: 'Điện tử - Viễn thông' },
  { id: '6', name: 'Khoa học & Công nghệ Vật liệu' },
  { id: '7', name: 'Hóa học' },
  { id: '8', name: 'Sinh học – Công nghệ Sinh học' },
  { id: '9', name: 'Môi trường' },
]
export const TAGS = [
  { value: 1, label: 'Cựu sinh viên' },
  { value: 2, label: 'Trường học' },
  { value: 3, label: 'Cộng đồng' },
  { value: 4, label: 'Khởi nghiệp' },
  { value: 5, label: 'Nghề nghiệp' },
  { value: 6, label: 'Học tập' },
  { value: 7, label: 'Việc làm' },
]
export const POST_STATUS = {
  Chờ: 1,
  'Bình thường': 2,
  Ẩn: 3,
  Xoá: 4,
}
export const REACTION_TYPE = {
  Like: 1,
}
export const GROUP_PRIVACY = {
  PUBLIC: 'Công khai',
  PRIVATE: 'Riêng tư',
}
export const GROUP_TABS = [
  {
    label: 'Thảo luận',
    url: '',
    rolesRequired: ['CREATOR', 'ADMIN', 'MEMBER'],
  },
  {
    label: 'Thành viên',
    url: 'members',
    rolesRequired: ['CREATOR', 'ADMIN', 'MEMBER'],
  },
  {
    label: 'Xét duyệt',
    url: 'member-requests',
    rolesRequired: ['CREATOR', 'ADMIN'],
  },
]
