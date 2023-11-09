import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { setCookie, checkProp2cmpProp, getBrowser, getOS, getTerms, postConsents, termProp2checkProp } from '../../helpers/utils';

import { CmpChild, CmpGroup, CustomCheckbox, CustomCheckboxLabel, ErrorMessage } from './styles'
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';


const CMP = (props) => {
	const { op, isSubmit, getMapingKey, handleOnChangeCheckbox, errorMessage, submitCount, isCmpValidProps, variablesObj, handleLinkClick, isFormValid = false, getInitTerms, isPostConsentsDone = false, hideCheckAll = false, paddingChild, forwardedRef } = props;
	const [term, setTerm] = useState(null);
	const [checkProperty, setCheckProperty] = useState({});
	const [selectedCMP, setSelectedCMP] = useState([]);
	const [termName, setTermName] = useState([]);
	const [cmpKey, setCmpKey] = useState('');
	const [count, setCount] = useState(false);

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


	const fetchData = async () => {

		op.platform = getOS() || '';
		op.browser = getBrowser() || '';
		const termResponse = await getTerms(op);
		if (termResponse?.data_obs) {
			setCmpKey(termResponse?.data_obs);
			// op['mapping_key'] = termResponse?.data_obs;
			//send cmp key to props
			console.log(termResponse?.data_obs)
			getInitTerms && getInitTerms(termResponse)
			// getMapingKey && getMapingKey(termResponse?.data_obs)
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


	const checkCMPValid = () => {
		return Object.values(checkProperty).every(value => value.property_value)
	}

	const handleChange = (event, checkboxId) => {
		const { value, checked } = event.target;
		// Update status property_value in TERM_CHECK_PROPERTY
		if (checkboxId) checkProperty[checkboxId].property_value = checked;

		handleOnChangeCheckbox && handleOnChangeCheckbox(checkProp2cmpProp(checkProperty));

		if (value === 'isAcceptByParent') {
			setSelectedCMP(selectedCMP.length === termName.length ? [] : termName);
			//  Update status property_value in TERM_CHECK_PROPERTY when check all
			Object.keys(checkProperty).forEach((key) => {
				checkProperty[key].property_value = checked ? true : false;
			});
			handleOnChangeCheckbox && handleOnChangeCheckbox(checkProp2cmpProp(checkProperty));

			//Check if CMP form valid or not
			isCmpValidProps && isCmpValidProps(checkCMPValid())
			return;
		}
		// setError('isAcceptByParent', { message: 'Vui lòng đồng ý để sử dụng dịch vụ' });

		// added below code to update selected options
		const list = [...selectedCMP];
		const index = list.indexOf(value);
		index === -1 ? list.push(value) : list.splice(index, 1);
		setSelectedCMP(list);

		//Check if CMP form valid or not
		isCmpValidProps && isCmpValidProps(checkCMPValid())
	};


	const hadleClickLinkChild = (event, val) => {
		if (event.target.tagName === 'A') {
			event.stopPropagation();
			event.preventDefault();
			handleLinkClick(val);
		}

	}


	const callApiConsents = async () => {
		setCount(true)

		console.log('isFormValid', isFormValid)
		let isCmpValid = checkCMPValid();
		console.log('isCmpValid', isCmpValid)

		if (!isFormValid || !isCmpValid) return;
		op.cmp_properties = checkProp2cmpProp(checkProperty);
		op.mapping_key = cmpKey;
		console.log('op truoc khi gui', op)
		// console.log('op when valid form and cmp', op)

		const statusPostConsents = await postConsents(op);
		console.log('statusPostConsents 2', statusPostConsents)
		if (statusPostConsents) {
			console.log('post consent thành công')
			console.log('mapping key trước khi gửi', cmpKey)
			getMapingKey(cmpKey) // Gửi mapping key ra ngoài , có mapping key là có tiền
		}

	}

	useImperativeHandle(forwardedRef, () => ({
		callApiConsents
	}))

	// useEffect(() => {

	// }, [submitCount])

	useEffect(() => {
		fetchData();

		// returned function will be called on component unmount 
	}, []);


	return (
		<div id="adtima-cmp-wrapper" ref={forwardedRef}>
			{!hideCheckAll && <CmpChild id="adtima-cmp-select-all">
				<CustomCheckbox
					// {...register('isAcceptByParent', { ...REGISTER_FORM_VALIDATES.isAcceptByParent })}
					type="checkbox"
					name="isAcceptByParent"
					value='isAcceptByParent'
					onChange={handleChange}
					checked={isAllSelected}
					id="cmp-checkbox-all"
				/>
				<CustomCheckboxLabel htmlFor="cmp-checkbox-all">{term?.name}</CustomCheckboxLabel>
			</CmpChild>}


			<CmpGroup id="cmp-term-wrapper" padding={paddingChild ? paddingChild : 1} >
				{term?.term_properties?.map((valueTerm, index) => {
					// let nameCheckbox = getKeyFormByName(valueTerm?.name);
					return (
						<>
							<CmpChild key={`checkbox_${index}`} id={`cmp-child-${index}`}>
								<CustomCheckbox
									id={`checkbox_${valueTerm._id}`}
									name={valueTerm?._id}
									type="checkbox"
									// {...register(nameCheckbox, { ...REGISTER_FORM_VALIDATES[nameCheckbox] })}
									value={valueTerm?._id}
									onChange={(e) => handleChange(e, valueTerm?._id)}
									checked={selectedCMP.includes(valueTerm?._id)}
								/>
								<CustomCheckboxLabel htmlFor={`checkbox_${valueTerm._id}`} id={`cmp-checkbox-label-${index}`}>
									<div onClick={(event) => hadleClickLinkChild(event, valueTerm)}>
										<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(variablesObj?.[valueTerm?.name].labelText) }}></div>
									</div>
									{variablesObj?.[valueTerm?.name].link?.length && <a onClick={(event) => hadleClickLinkChild(event, valueTerm)} >{variablesObj?.[valueTerm?.name].labelText}</a>}
								</CustomCheckboxLabel>
							</CmpChild>
							{!checkProperty?.[valueTerm?._id].property_value && count && <ErrorMessage id={`cmp-error-message-${index}`}>{checkProperty?.[valueTerm?._id].error_message}</ErrorMessage>}
						</>
					)
				})}
			</CmpGroup>
		</div>
	)
}

export default forwardRef(CMP);
