// API trả về name dạng "Đủ 18 tuổi", "Quy định và điều kiện sử dụng"
// Nên convert qua isOver18 , isPolicy ..
export const CONVERT_CMP_NAME_TO_PUTFORM = {
	'Thể lệ chương trình': 'isTnc',
	'Đủ 18 tuổi': 'isOver18',
	'Chính sách thỏa thuận sử dụng dịch vụ': 'isPolicy',
};

export const getKeyFormByName = (val) => {
	return CONVERT_CMP_NAME_TO_PUTFORM[val] || [];
};

