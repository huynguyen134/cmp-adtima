
 
# CMP (Consent Management Platform)
CMP (Consent Management Platform) là một công cụ phần mềm giúp bạn thu thập và quản lý thông tin cá nhân và sự đồng ý của người dùng theo các luật và quy định về bảo vệ dữ liệu, như GDPR của EU, CCPA của California, hay LGPD của Brazil. CMP cho phép bạn hiển thị các thông báo hoặc hộp thoại yêu cầu sự đồng ý của người dùng trước khi thu thập, chia sẻ, hay bán dữ liệu người dùng từ các nguồn trực tuyến như website, ứng dụng, cookie, video nhúng, và các công nghệ theo dõi khác CMP cũng giúp bạn lưu trữ, quản lý, và cập nhật các thông tin về sự đồng ý của người dùng, và truyền dữ liệu đó cho các đối tác quảng cáo hay dịch vụ bên dưới.

Bạn cần CMP để tuân thủ các quy định về bảo vệ dữ liệu, đảm bảo quyền riêng tư, minh bạch, và kiểm soát cho người dùng, và tránh các rủi ro pháp lý hay tiềm năng bị phạt nặng. CMP cũng giúp bạn tăng cường niềm tin và sự gắn kết của người dùng, và cải thiện hiệu quả của chiến dịch quảng cáo mục tiêu

OK CHƯA ?

# Cái này dùng để làm gì vại ?

•  Tạo consent chứa các thông tin cơ bản về người dùng, nguồn dữ liệu, mục đích sử dụng, và thời hạn của sự đồng ý 

•  Tự kiểm tra tính hợp lệ, đầy đủ, và cập nhật của các đối tượng consent

•  Gửi đối tượng consent đã khởi tạo đến một hệ thống quản lý consent, để lưu trữ, chia sẻ, và cập nhật các thông tin về sự đồng ý của người dùng .


# How do I use it?

**Install**

```js
npm i cmp-adtima
```

 **Import**
```js
import { CMP } from  'cmp-adtima';
```

  

 **Use**

```js
<CMP
	op={{
		organization_id: 'xxxxxxxxxx', // Nếu là người mới liên hiện TamNN để được cung cấp
		term_id: 'xxxxxx', // Nếu là người mới liên hiện TamNN để được cung cấp
		extend_app_id: '', //Nếu có vui lòng truyền qua thường sẽ là CAMPAIGN_ID
		extend_app_name: 'Adtima Gamelab', // Tên dự án
		extend_uid: '', // Nếu có vui lòng truyền qua tường sẽ là _id của user
	}}
	getMapingKey={getMapingKey}  // Return term init object từ /digital-api , Bạn có thể lấy được cmp_key ở đây thông qua value.data_obs
	handleOnChangeCheckbox={handleOnChangeCheckbox}  // Trả về data khi sự kiện onChange của checkbox bên trong trigger , dùng dữ liệu này để đẩy lên API postConsents thông qua cmp_properties
	variablesObj={{  //Dùng để hiển thị error_message của checkbox khi validate
		"Đủ 18 tuổi": { // Lấy consent_name để hiển thị
			errorMessage: 'Vui Lòng đồng ý nếu bạn trên 18', // Error message của consents tương ứng
			labelText: `<div>Tui đã trên 18 tuổi</div>`, // Label text của constent bạn muốn hiển thị cho
		},
		"Chính sách thỏa thuận sử dụng dịch vụ": {
			errorMessage: 'Vui Lòng đồng ý dịch vụ',
			labelText: `<div>Đồng ý điều <a href="https://adtima.vn/thoa-thuan-su-dung-dich-vu" target="_blank" class="test">khoản</a> haha<div>`,
		}
	}}
	handleLinkClick={(val) =>  console.log(val)}  // Nếu labelText có link thì sẽ trả về data object của constent đó tỏng trường hợp muốn mở modal hoặc link ra nơi khác . Lưu ý: BẮT BUỘC link click phải là thẻ a
	submitCount={count}  //Nếu bạn sử dụng useForm thì để formState.submitCount vaò hoặc bỏ 1 biến để count số lần submit lên ^^
	cmpValid={(isValid) =>  setCmpValid(isValid)}  // Validate của phần cmp được thực thi bên trong và trả về true hoặc false . Bạn có thể check biến này để call API bên ngoài
/>
```

## Style
Để style lại checkbox theo từng project . Copy những phần này vào root variables

```js
/* cmp checkbox appearance */
--cmp-border-checkbox-width: 2px; /* checkbox border width */
--cmp-bg-checkbox-border-radius: 2px; /* checkbox border width */
--cmp-bg-checkbox-normal-color: pink; /* checkbox background color when not checked */
--cmp-bg-checkbox-checked-color: red; /* checkbox background color when checked */
--cmp-checkbox-border-normal-color: red; /* checkbox border color when not checked */
--cmp-checkbox-border-checked-color: blue; /* checkbox border color when checked */
--cmp-icon-checkbox-checked-color: yellow; /* checkbox icon check color */
--cmp-error-message-color: red; /* error message color */
```
## Props
Props of the [CMP](https://github.com/huynguyen134/cmp-adtima) component are also available.


| Name| Default value| Type| Description
| ------------- |:-------------:| -----| :-----|
| **op***      | -| *`object`* | **op** là object dùng để khởi tạo term ban đầu thông qua *`'/digital-api/'`* bao gồm những field cần và đủ như  <br/> **`organization_id`**: "*your id here*" <br/> **`term_id`**: "*your term id here*"	<br/> **`extend_app_id`**: "*your CAMPAIGN_ID*"	<br/> **`extend_app_name`**: "*your project name*"	<br/> **`extend_uid`**: "*your user id*"
| **variablesObj***|   true   |    *`object`* | Dùng để render phần nội dung của checkbox và error message của checkbox đó <br/> **`Object key`**: lấy consent_name trong terms để làm key ví dụ: *`Đủ 18 tuổi`* <br/> **`errorMessage:`** hiển thị error message của consent  tương ứng <br/> **`labelText`**: hiển thị label text của checkbox tương ứng
| **cmpValid***|   false|    *`boolean`* | Giá trị **`true`** khi tất cả các checkbox được check và **`false`** khi chưa check đủ validate sẽ thực thi trong này , dùng để validate bên ngoài form
| **getInitTerms***|   -|    *`function`* | Trả về object init terms 
| **submitCount***|   -|    *`number`* | Dùng để validate của CMP nếu sử dung useForm thì xài **`formState.submitCount`** hoặc tạo biến **`count`** increment
| **getMapingKey**      | -|   *`string`* | Dùng để bỏ vào **`cmp_key`*** khi submit form
| **handleOnChangeCheckbox** |   -   |    *`object`* | Được gọi khi mỗi lần onChange checkbox
| **handleLinkClick**|   -   |    *`function`* | Được gọi khi nhấn vào đường link trong **`labelText`** <br/>***Lưu ý***: Thẻ tag trong **`labelText`** phải là thẻ **`a`**
| **hideCheckAll**|   false|    *`boolean`* | Giá trị **`true`** thì sẽ ẩn checkbox *`Đồng ý tất cả`* 
| **paddingChild**|   1   |    *`number`* | Giá trị được tính theo **`rem`** phòng khi trường hợp **hideCheckAll** có giá trị là **`true`**


