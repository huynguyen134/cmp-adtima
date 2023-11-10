import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { setCookie, checkProp2cmpProp, getBrowser, getOS, getTerms, postConsents, termProp2checkProp } from '../../helpers/utils';

import { CmpChild, CmpGroup, CustomCheckbox, CustomCheckboxLabel, ErrorMessage } from './styles'
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';


const CMP = forwardRef((props, ref) => {
	const { op, isSubmit, getMapingKey, handleOnChangeCheckbox, errorMessage, submitCount, classes, isCmpValidProps, variablesObj, handleLinkClick, isFormValid = false, getInitTerms, isPostConsentsDone = false, hideCheckAll = false } = props;
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
			// getInitTerms && getInitTerms(termResponse)
			// getMapingKey && getMapingKey(termResponse?.data_obs)
		}

		if (termResponse?.term?.record?.length) {
			const tempRecord = termResponse?.term?.record[0];
			setTerm(tempRecord);
			handelGetTermName(tempRecord);
			// Create TERM_CHECK_PROPERTY
			// Update value when onChange Term
			// Push to op and push to /cmp-consents in postConsents
			const TERM_CHECK_PROPERTY = termProp2checkProp(tempRecord?.term_properties);
			// Set init for checkProperty state
			setCheckProperty(TERM_CHECK_PROPERTY);

		}
	};

	const checkCMPValid = () => {
		// handleSetErrorMessage();
		Object.values(checkProperty).map((ele) => {
			setCheckProperty(prev => {
				return ({
					...prev,
					[ele.property_id]: {
						...prev[ele.property_id],
						error_message: prev[ele.property_id].property_value ? '' : variablesObj?.[ele.property_name].errorMessage
					}
				})
			}
			)
		})
		return Object.values(checkProperty).every(value => value.property_value)

	}

	const handleChange = (event, checkboxId) => {
		const { value, checked } = event.target;
		// Update status property_value in TERM_CHECK_PROPERTY
		if (checkboxId) checkProperty[checkboxId].property_value = checked;

		handleOnChangeCheckbox && handleOnChangeCheckbox(checkProperty);

		if (value === 'isAcceptByParent') {
			setSelectedCMP(selectedCMP.length === termName.length ? [] : termName);
			//  Update status property_value in TERM_CHECK_PROPERTY when check all
			Object.keys(checkProperty).forEach((key) => {
				checkProperty[key].property_value = checked ? true : false;
			});

			handleOnChangeCheckbox && handleOnChangeCheckbox(checkProperty);

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

		let isCmpValid = checkCMPValid();

		if (!isFormValid || !isCmpValid) return;
		op.cmp_properties = checkProp2cmpProp(checkProperty);
		op.mapping_key = cmpKey;

		const statusPostConsents = await postConsents(op);
		if (statusPostConsents) {
			getMapingKey(cmpKey) // Gửi mapping key ra ngoài , có mapping key là có tiền
		}

	}

	useImperativeHandle(ref, () => ({
		callApiConsents,
		checkCMPValid
	}))



	useEffect(() => {
		fetchData();

		// returned function will be called on component unmount 
	}, []);


	return (
		<div ref={ref} className={classes}>
			{!hideCheckAll && <CmpChild className="cmp-adtima-checkox-all">
				<CustomCheckbox
					// {...register('isAcceptByParent', { ...REGISTER_FORM_VALIDATES.isAcceptByParent })}
					type="checkbox"
					name="isAcceptByParent"
					value='isAcceptByParent'
					onChange={handleChange}
					checked={isAllSelected}
					id="isAcceptByParent"
					className="cmp-adtima-checkbox"
				/>
				<CustomCheckboxLabel htmlFor="isAcceptByParent" className="cmp-adtima-label">{term?.name}</CustomCheckboxLabel>
			</CmpChild>}


			<CmpGroup className="cmp-adtima-group">
				{term?.term_properties?.map((valueTerm, index) => {
					// let nameCheckbox = getKeyFormByName(valueTerm?.name);
					return (
						<div key={`checkbox_${valueTerm._id}`} className="cmp-adtima-group-child">
							<CmpChild className='cmp-adtima-child'>
								<CustomCheckbox
									id={`checkbox_${valueTerm._id}`}
									name={valueTerm?._id}
									type="checkbox"
									className="cmp-adtima-checkbox"
									// {...register(nameCheckbox, { ...REGISTER_FORM_VALIDATES[nameCheckbox] })}
									value={valueTerm?._id}
									onChange={(e) => handleChange(e, valueTerm?._id)}
									checked={selectedCMP.includes(valueTerm?._id)}
								/>
								<CustomCheckboxLabel htmlFor={`checkbox_${valueTerm._id}`} className="cmp-adtima-label-wrap">
									<div onClick={(event) => hadleClickLinkChild(event, valueTerm)} className="cmp-adtima-label" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(variablesObj?.[valueTerm?.name].labelText) }}></div>
									{variablesObj?.[valueTerm?.name].link?.length && <a onClick={(event) => hadleClickLinkChild(event, valueTerm)} >{variablesObj?.[valueTerm?.name].labelText}</a>}
								</CustomCheckboxLabel>
							</CmpChild>
							{/* {!checkProperty?.[valueTerm?._id].property_value && <ErrorMessage id={`cmp-error-message-${index}`}>{checkProperty?.[valueTerm?._id].error_message}</ErrorMessage>} */}
							{!checkProperty?.[valueTerm?._id]?.property_value && <ErrorMessage className="cmp-adtima-error-message">{checkProperty?.[valueTerm?._id]?.error_message}</ErrorMessage>}

						</div>
					)
				})}
			</CmpGroup>
		</div>
	)
})

export default CMP;
