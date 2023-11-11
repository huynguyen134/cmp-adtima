

 
# CMP (Consent Management Platform)
CMP (Consent Management Platform) là một công cụ phần mềm giúp bạn thu thập và quản lý thông tin cá nhân và sự đồng ý của người dùng theo các luật và quy định về bảo vệ dữ liệu, như GDPR của EU, CCPA của California, hay LGPD của Brazil. CMP cho phép bạn hiển thị các thông báo hoặc hộp thoại yêu cầu sự đồng ý của người dùng trước khi thu thập, chia sẻ, hay bán dữ liệu người dùng từ các nguồn trực tuyến như website, ứng dụng, cookie, video nhúng, và các công nghệ theo dõi khác CMP cũng giúp bạn lưu trữ, quản lý, và cập nhật các thông tin về sự đồng ý của người dùng, và truyền dữ liệu đó cho các đối tác quảng cáo hay dịch vụ bên dưới.

Bạn cần CMP để tuân thủ các quy định về bảo vệ dữ liệu, đảm bảo quyền riêng tư, minh bạch, và kiểm soát cho người dùng, và tránh các rủi ro pháp lý hay tiềm năng bị phạt nặng. CMP cũng giúp bạn tăng cường niềm tin và sự gắn kết của người dùng, và cải thiện hiệu quả của chiến dịch quảng cáo mục tiêu

OK CHƯA ?

# Cái này dùng để làm gì vại ?

•  Tạo consent chứa các thông tin cơ bản về người dùng, nguồn dữ liệu, mục đích sử dụng, và thời hạn của sự đồng ý 

•  Kiểm tra tính hợp lệ, đầy đủ, và cập nhật của các đối tượng consent

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
		organization_id: 'xxxxxxxxxx', // phải có
		term_id: 'xxxxxx',  // phải có
		extend_app_id: 'your CAMPAIGN_ID', // không có thì để trống
		extend_app_name: 'your project name', // Tên dự án
		extend_uid: 'your user id', // không có thì để trống
	}}
	getMapingKey={handleCallApiForm}
	isFormValid={formState.isValid} 
	variablesObj={{
		"Đủ 18 tuổi": {
			errorMessage: 'Vui Lòng đồng ý nếu bạn trên 18', 
			labelText: `<div>Tui đã trên 18 tuổi</div>`,
		},
		"Chính sách thỏa thuận sử dụng dịch vụ": {
			errorMessage: 'Vui Lòng đồng ý dịch vụ',
			labelText: `<div>Đồng ý điều <a href="https://adtima.vn/thoa-thuan-su-dung-dich-vu" target="_blank" class="test">khoản</a> haha<div>`,
		}
	}}
	handleLinkClick={handleLinkClick}
	ref={cmpRef}
/>
```

## Props
Props of the [CMP](https://github.com/huynguyen134/cmp-adtima) component are also available.

| Name| Default value| Type| Description
| ------------- |:-------------:| -----| :-----|
| **op***      | -| *`object`* | **op** là object dùng để khởi tạo term ban đầu thông qua *`'/digital-api/'`* bao gồm những field cần và đủ như  <br/> **`organization_id`**: "*your id here*" <br/> **`term_id`**: "*your term id here*"	<br/> **`extend_app_id`**: "*your CAMPAIGN_ID*"	<br/> **`extend_app_name`**: "*your project name*"	<br/> **`extend_uid`**: "*your user id*"
| **getMapingKey***      | -|   *`string`* | Dùng để bỏ vào **`cmp_key`*** khi submit form có thể submit form khi key được trả về 
| **variablesObj***|   -   |    *`object`* | Dùng để render phần nội dung của checkbox và error message của checkbox đó <br/> **`Object key`**: lấy consent_name trong terms để làm key ví dụ: *`Đủ 18 tuổi`* <br/> **`errorMessage:`** hiển thị error message của consent  tương ứng <br/> **`labelText`**: hiển thị label text của checkbox tương ứng
| **isFormValid***|   false|    *`boolean`* | Giá trị cần phải có để **`CMP`** kiểm tra để **`callApiConsents`** được thực thi
| **isCmpValidProps**|   false|    *`boolean`* | Giá trị **`true`** khi tất cả các checkbox được check và **`false`** khi chưa check đủ validate sẽ thực thi trong này , dùng để validate bên ngoài form
| **getInitTerms**|   -|    *`function`* | Trả về object init terms 
| **handleOnChangeCheckbox** |   -   |    *`object`* | Được gọi khi mỗi lần onChange checkbox
| **handleLinkClick**|   -   |    *`function`* | Được gọi khi nhấn vào đường link trong **`labelText`** <br/>***Lưu ý***: Thẻ tag trong **`labelText`** phải là thẻ **`a`**
| **hideCheckAll**|   false|    *`boolean`* | Giá trị **`true`** thì sẽ ẩn checkbox *`Đồng ý tất cả`* 
| **classes**|   -|    *`string`* | Tạo class để style lại trong  **`CMP`** 


## Style
Để style lại checkbox theo từng project . Copy những phần này vào root variables

```js
/* cmp checkbox appearance */
--cmp-checkbox-height: 16px; /* checkbox height */
--cmp-checkbox-width: 16px; /* checkbox width */
--cmp-border-checkbox-width: 2px; /* checkbox border width */
--cmp-bg-checkbox-border-radius: 2px; /* checkbox border width */
--cmp-bg-checkbox-normal-color: pink; /* checkbox background color when not checked */
--cmp-bg-checkbox-checked-color: red; /* checkbox background color when checked */
--cmp-checkbox-border-normal-color: red; /* checkbox border color when not checked */
--cmp-checkbox-border-checked-color: blue; /* checkbox border color when checked */
--cmp-icon-checkbox-checked-color: yellow; /* checkbox icon check color */
--cmp-error-message-color: red; /* error message color */
```

## Ví dụ ?
 [MIMS-Miniapp](https://gitlab.zsl.zalo.services/zsl-tech/adtimabox/cp-mini-app/2023-campaign-form-mims-miniapp)