
## CMP (Consent Management Platform)

NĐ 13 thực thi thì mới có cái này , chứ bình thường ai rãnh đâu mà làm ?

## What does it do?

Tạo xài lại cho các project React khác 

## How do I use it?

Install

```html
npm i cmp-adtima
```

Import vào project
```js
import { CMP } from 'cmp-adtima';
```

Sử dụng

```js
<CMP 
	op={{
		organization_id: '6503fb38c636b9a83f04a5c3',
		term_id: '65040578c636b9a83f04a745',
		extend_app_id: 0,
		extend_app_name: 'Adtima Gamelab',
		extend_uid: 0,
		platform: '',
		browser: '',
	}}
	getMapingKey={getMapingKey}
	handleOnChangeCheckbox={handleOnChangeCheckbox}
	variablesObj={{
		"Đủ 18 tuổi": {
			errorMessage: 'Vui Lòng đồn(g ý nếu bạn trên 18',
			labelText: `<div>Tui đã trên 18 tuổi</div>`,
		},
		"Chính sách thỏa thuận sử dụng dịch vụ": {
		errorMessage: 'Vui Lòng đồng ý dịch vụ',
		labelText: `<div>Đồng ý điều <a href="https://adtima.vn/thoa-thuan-su-dung-dich-vu" target="_blank" class="test">khoản</a> haha<div>`,
		}
	}}
	handleLinkClick={(val) => console.log(val)}
	submitCount={count}
	cmpValid={(isValid) => setCmpValid(isValid)}
/>
```
