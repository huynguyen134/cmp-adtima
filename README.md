
# Project Title

A brief description of what this project does and who it's for



 
# CMP (Consent Management Platform)
CMP (Consent Management Platform) là một công cụ phần mềm giúp bạn thu thập và quản lý thông tin cá nhân và sự đồng ý của người dùng theo các luật và quy định về bảo vệ dữ liệu, như GDPR của EU, CCPA của California, hay LGPD của Brazil. CMP cho phép bạn hiển thị các thông báo hoặc hộp thoại yêu cầu sự đồng ý của người dùng trước khi thu thập, chia sẻ, hay bán dữ liệu người dùng từ các nguồn trực tuyến như website, ứng dụng, cookie, video nhúng, và các công nghệ theo dõi khác CMP cũng giúp bạn lưu trữ, quản lý, và cập nhật các thông tin về sự đồng ý của người dùng, và truyền dữ liệu đó cho các đối tác quảng cáo hay dịch vụ bên dưới.

Bạn cần CMP để tuân thủ các quy định về bảo vệ dữ liệu, đảm bảo quyền riêng tư, minh bạch, và kiểm soát cho người dùng, và tránh các rủi ro pháp lý hay tiềm năng bị phạt nặng. CMP cũng giúp bạn tăng cường niềm tin và sự gắn kết của người dùng, và cải thiện hiệu quả của chiến dịch quảng cáo mục tiêu

OK CHƯA ?

# Cái này dùng để làm gì ?

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

**Cách 1: Truyền extend_uid với user id (recommended)**

Cần kiểm tra user id trước để render ra vì extend_uid trước khi gửi và sau khi gửi phải giống nhau nếu không sẽ báo lỗi khi gọi API tạo consents

```js
{userInfor?._id &&
    <CMP
        op={{
            organization_id: "655c69b20b8952907f45bb01",
            term_id: "655c6ad10b8952907f45bbab",
            extend_app_id: import.meta.env.VITE_CAMPAIGN_ID,
            extend_app_name: "Signify",
            extend_uid: userInfor?._id || '0'
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
}
```
Gọi api thành công sẽ trả về mapping_key, dùng mapping_key đó update lại thông tin người dùng ( phần này không cần cũng được nhưng để tường minh thì nên làm)
```js
const postConsentsRespone = await cmpRef.current.callApiConsents(userInfor?._id);
VD: cmp_key = postConsentsRespone.mapping_key
```

**Cách 2: Không Truyền extend_uid**

Nếu không truyền thì mặc định extend_uid sẽ bằng '0'

```js
<CMP
    op={{
        organization_id: "655c69b20b8952907f45bb01",
        term_id: "655c6ad10b8952907f45bbab",
        extend_app_id: import.meta.env.VITE_CAMPAIGN_ID,
        extend_app_name: "Signify",
        extend_uid: '0'
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
Gọi api thành công sẽ trả về mapping_key, dùng mapping_key đó update lại thông tin người dùng ( phần này không cần cũng được nhưng để tường minh thì nên làm)
```js
const postConsentsRespone = await cmpRef.current.callApiConsents();
```

## Props
Props of the [CMP](https://github.com/huynguyen134/cmp-adtima) component are also available.

| Name| Default value| Type| Description
| ------------- |:-------------:| -----| :-----|
| **op***      | -| *`object`* | **op** là object dùng để khởi tạo term ban đầu thông qua *`'/digital-api/'`* bao gồm những field cần và đủ như  <br/> **`organization_id`**: "*your id here*" <br/> **`term_id`**: "*your term id here*"	<br/> **`extend_app_id`**: "*your CAMPAIGN_ID*"	<br/> **`extend_app_name`**: "*your project name*"	<br/> **`extend_uid`**: "*your user id*"
| **variablesObj***|   -   |    *`object`* | Dùng để render phần nội dung của checkbox và error message của checkbox đó <br/> **`Object key`**: lấy consent_name trong terms để làm key ví dụ: *`Đủ 18 tuổi`* <br/> **`errorMessage:`** hiển thị error message của consent  tương ứng <br/> **`labelText`**: hiển thị label text của checkbox tương ứng
| **isFormValid***|   false|    *`boolean`* | Giá trị cần phải có để **`CMP`** kiểm tra để **`callApiConsents`** được thực thi
| **ref***|   -|    - | Components sử dụng [**\[`Forwarding Refs`**\]](https://legacy.reactjs.org/docs/forwarding-refs.html) để kiêm tra tính hợp lệ và gọi API consents bao gồm 2 function **`callApiConsents`** và **`checkCMPValid`** <br/>Ví dụ: **`cmpRef.current.callApiConsents();`** để gọi api tạo consents
| **isCmpValidProps**|   false|    *`boolean`* | Giá trị **`true`** khi tất cả các checkbox được check và **`false`** khi chưa check đủ validate sẽ thực thi trong này , dùng để validate bên ngoài form
| **getInitTerms**|   -|    *`function`* | Trả về object init terms 
| **handleOnChangeCheckbox** |   -   |    *`object`* | Được gọi khi mỗi lần onChange checkbox
| **handleLinkClick**|   -   |    *`function`* | Được gọi khi nhấn vào đường link trong **`labelText`** <br/>***Lưu ý***: Thẻ tag trong **`labelText`** phải là thẻ **`a`**
| **hideCheckAll**|   false|    *`boolean`* | Giá trị **`true`** thì sẽ ẩn checkbox *`Đồng ý tất cả`* 
| **classes**|   -|    *`string`* | Tạo class để style lại trong  **`CMP`** 


## Style
Để style lại checkbox theo từng project . Copy những phần này vào root variables
 - **Cách 1**
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
 - **Cách 2**
	Sử dụng props **``classes``** để overwrite lại css

```js
.cmp-custom {
  font-size: 16px;

  .cmp-adtima-link {
    color: var(--primary, #f81a22);
    font-weight: 500;
  }

  .cmp-adtima-error-message {
    font-size: var(--step--2);
    line-height: 18px;
  }

  input[type="checkbox"] {
    &:checked {
      &::before {
        content: "";
        border: none;
        background: url("@/assets/images/icon_checkbox.svg") no-repeat center center;
        background-size: 10px;
        width: 100%;
        height: 100%;
        inset: 0;
        margin: 0;
        transform: unset;
      }
    }
  }
}

```

## Ví dụ ?
 MIMS-Miniapp 
 
 SIGNIFY-Miniapp