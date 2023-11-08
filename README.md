
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
	organization_id: 'xxxxxxxxxx', // Nếu là người mới liên hiện TamNN để được cung cấp
	term_id: 'xxxxxx', // Nếu là người mới liên hiện TamNN để được cung cấp
	extend_app_id: 0,
	extend_app_name: 'Adtima Gamelab', 
	extend_uid: 0,
	platform: '',
	browser: '',
  }}
  getMapingKey={getMapingKey} // Return term init object từ /digital-api , Bạn có thể lấy được cmp_key ở đây thông qua value.data_obs
  handleOnChangeCheckbox={handleOnChangeCheckbox}  // Trả về data khi sự kiện onChange của checkbox bên trong trigger , dùng dữ liệu này để đẩy lên API postConsents thông qua cmp_properties
  variablesObj={{ //Dùng để hiển thị error_message của checkbox khi validate
	"Đủ 18 tuổi": { //constents_name
	  errorMessage: 'Vui Lòng đồn(g ý nếu bạn trên 18',
	  labelText: `<div>Tui đã trên 18 tuổi</div>`, //Label text của constent bạn muốn hiển thị cho "Đủ 18 tuổi"
	},
	"Chính sách thỏa thuận sử dụng dịch vụ": {
	  errorMessage: 'Vui Lòng đồng ý dịch vụ',
	  labelText: `<div>Đồng ý điều <a href="https://adtima.vn/thoa-thuan-su-dung-dich-vu" target="_blank" class="test">khoản</a> haha<div>`,
	}
  }}
  handleLinkClick={(val) => console.log(val)} // Nếu labelText có link thì sẽ trả về data object của constent đó tỏng trường hợp muốn mở modal hoặc link ra nơi khác . Lưu ý: BẮT BUỘC link phải là thẻ a
  submitCount={count} //Nếu bạn sử dụng useForm thì để formState.submitCount vaò hoặc bỏ 1 biến để count số lần submit lên ^^
  cmpValid={(isValid) => setCmpValid(isValid)} // Validate của phần cmp được thực thi bên trong và trả về true hoặc false . Bạn có thể check biến này để call API bên ngoài
/>
```
