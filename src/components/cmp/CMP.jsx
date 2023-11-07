import React, { useState, useEffect } from 'react'
import { setCookie, checkProp2cmpProp, getBrowser, getOS, getTerms, postConsents, termProp2checkProp } from '../../helpers/utils';

import { CmpChild, CmpGroup, CustomCheckbox, CustomCheckboxLabel } from './styles'
import DOMPurify from "dompurify";



const CMP = (props) => {
	const { op, isSubmit, getMapingKey, handleOnChangeCheckbox, errorMessage, submitCount, isCmpValidProps, variablesObj } = props;
	const [term, setTerm] = useState(null);
	const [checkProperty, setCheckProperty] = useState({});
	const [selectedCMP, setSelectedCMP] = useState([]);
	const [termName, setTermName] = useState([]);
	const [cmpKey, setCmpKey] = useState('');

	const isAllSelected = termName.length > 0 && selectedCMP.length === termName.length;

	//GET name của term và sau đó convert
	const handelGetTermName = (dataTerm) => {
		if (dataTerm) {
			const setValue = new Set(termName);
			dataTerm?.term_properties.map(ele => {
				setValue.add(ele._id);
				return setTermName([...setValue]);
			});
		}
	};

	console.log('termName', termName)

	const fetchData = async () => {
		const termResponse = await getTerms(op);
		if (termResponse?.data_obs) {
			setCmpKey(termResponse?.data_obs);
			op['mapping_key'] = termResponse?.data_obs;
			//send cmp key to props
			console.log(termResponse?.data_obs)
			getMapingKey(termResponse?.data_obs)
		}

		if (termResponse?.term?.record?.length) {
			const tempRecord = termResponse?.term?.record[0];
			setTerm(tempRecord);
			handelGetTermName(tempRecord);
			// Create TERM_CHECK_PROPERTY
			// Update value when onChange Term
			// Push to op and push to /cmp-consents in postConsents
			const TERM_CHECK_PROPERTY = termProp2checkProp(tempRecord?.term_properties, variablesObj);
			// Set init for checkProperty state
			setCheckProperty(TERM_CHECK_PROPERTY);

		}
	};
	console.log('termName', termName);

	const checkCMPValid = () => {
		return Object.values(checkProperty).every(value => value.property_value)
	}

	const handleChange = (event, checkboxId) => {
		const { value, checked } = event.target;
		// Update status property_value in TERM_CHECK_PROPERTY
		if (checkboxId) checkProperty[checkboxId].property_value = checked;
		console.log(checkProperty)

		handleOnChangeCheckbox(checkProp2cmpProp(checkProperty));

		if (value === 'isAcceptByParent') {
			console.log('check all', selectedCMP)
			console.log('check all', termName)
			setSelectedCMP(selectedCMP.length === termName.length ? [] : termName);
			//  Update status property_value in TERM_CHECK_PROPERTY when check all
			Object.keys(checkProperty).forEach((key) => {
				checkProperty[key].property_value = checked ? true : false;
			});
			handleOnChangeCheckbox(checkProp2cmpProp(checkProperty));

			//Check if CMP form valid or not
			isCmpValidProps(checkCMPValid())
			return;
		}
		// setError('isAcceptByParent', { message: 'Vui lòng đồng ý để sử dụng dịch vụ' });

		// added below code to update selected options
		const list = [...selectedCMP];
		const index = list.indexOf(value);
		index === -1 ? list.push(value) : list.splice(index, 1);
		setSelectedCMP(list);
		console.log('value', value)
		console.log('checked', checked)

		//Check if CMP form valid or not
		isCmpValidProps(checkCMPValid())


	};



	const handleConvertCMPLabel = (type, consentValue) => {
		switch (type) {
			case '1':
				return <div>Đủ trên 18 tuổi</div>;
				break;
			case '2':
				return (
					<div>
						Chính sách {' '}
						<span className='policy-link' onClick={(event) => { event.preventDefault(); window.open(`https://adtima.vn/thoa-thuan-su-dung-dich-vu`, '_blank') }}>
							thỏa thuận sử dụng dịch vụ
						</span>
					</div>
				);
				break;
		}
	};

	useEffect(() => {
		// if (submitCount > 0) {
		//     if (selectedCMP.length < 2) {
		//         setError('isAcceptByParent', { message: 'Vui lòng đồng ý để sử dụng dịch vụ' });

		//     } else { clearErrors('isAcceptByParent') }
		// }

	}, [selectedCMP])

	useEffect(() => {
		// if (submitCount > 0) {
		// 	let isCMPValid = Object.values(checkProperty).every(value => value.property_value);
		// 	console.log('isCMPValid', isCMPValid)
		// 	isCmpValidProps(isCMPValid)

		// }
		// if (submitCount > 0) {
		//     if (selectedCMP.length < 2) {
		//         setError('isAcceptByParent', { message: 'Vui lòng đồng ý để sử dụng dịch vụ' });

		//     } else { clearErrors('isAcceptByParent') }
		// }
	}, [submitCount])

	useEffect(() => {
		fetchData();
		// returned function will be called on component unmount 
	}, []);


	return (
		<div>
			<CmpChild>
				<CustomCheckbox
					// {...register('isAcceptByParent', { ...REGISTER_FORM_VALIDATES.isAcceptByParent })}
					type="checkbox"
					id="checkbox-all"
					name="isAcceptByParent"
					value='isAcceptByParent'
					onChange={handleChange}
					checked={isAllSelected}
				/>
				<CustomCheckboxLabel htmlFor="checkbox-all">{term?.name}</CustomCheckboxLabel>
			</CmpChild>

			<CmpGroup>
				{term?.term_properties?.map((valueTerm, index) => {
					// let nameCheckbox = getKeyFormByName(valueTerm?.name);
					return (
						<>
							<CmpChild key={`checkbox_${index}`}>
								<CustomCheckbox
									id={`checkbox_${valueTerm._id}`}
									name={valueTerm?._id}
									type="checkbox"
									// {...register(nameCheckbox, { ...REGISTER_FORM_VALIDATES[nameCheckbox] })}
									value={valueTerm?._id}
									onChange={(e) => handleChange(e, valueTerm?._id)}
									checked={selectedCMP.includes(valueTerm?._id)}
								/>
								{/* <CustomCheckboxLabel htmlFor={`checkbox_${valueTerm._id}`} dangerouslySetInnerHTML={{ __html: variablesObj?.[valueTerm?.name].labelText }} /> */}
								<CustomCheckboxLabel htmlFor={`checkbox_${valueTerm._id}`}>
									<div dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(variablesObj?.[valueTerm?.name].labelText, {
											ALLOWED_TAGS: ["a", "b", "div", "b"],
											ALLOWED_ATTR: ["onclick", "href", "target"]
										})
									}}></div>
									{/* <iframe srcDoc={variablesObj?.[valueTerm?.name].labelText} frameBorder="0" style={{ height: 'auto' }}></iframe> */}
								</CustomCheckboxLabel>
							</CmpChild>
							{!checkProperty?.[valueTerm?._id].property_value && submitCount > 0 && <div>{checkProperty?.[valueTerm?._id].error_message}</div>}
							{/* {`<div>${checkProperty?.[nameCheckbox].error_message}</div >`} */}
							{/* {`< div > ${ for (const property in checkProperty) checkProperty.filter(ele => ele.property_id === valueTerm._id && ele.property_id ? '' : '123') }</div>`} */}
						</>
					)
				})}
			</CmpGroup>
			{/* {errors?.isAcceptByParent && (
		<div className="error-field">{errors?.isAcceptByParent
		  ?.message}</div>)} */}



		</div>
	)
}

export default CMP
