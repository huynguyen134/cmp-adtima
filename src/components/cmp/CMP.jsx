import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { setCookie, checkProp2cmpProp, getBrowser, getOS, getTerms, postConsents, termProp2checkProp } from '../../helpers/utils';

import { CmpChild, CmpGroup, CustomCheckbox, CustomCheckboxLabel, ErrorMessage } from './styles'
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';


const CMP = forwardRef((props, ref) => {
	const { op, handleOnChangeCheckbox, classes, variablesObj, handleLinkClick, isFormValid = false, getInitTerms, hideCheckAll = false } = props;
	const [term, setTerm] = useState(null);
	const [checkProperty, setCheckProperty] = useState({});
	const [selectedCMP, setSelectedCMP] = useState([]);
	const [termName, setTermName] = useState([]);
	const [cmpKey, setCmpKey] = useState('');
	const [showErrors, setShowError] = useState('');

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


	const callApiGetTerms = async (userInforId = 0) => {
		op.platform = getOS() || '';
		op.browser = getBrowser() || '';
		op.extend_uid = userInforId.toString();
		const termResponse = await getTerms(op);
		if (termResponse) {
			setCmpKey(termResponse?.data_obs);
			// op['mapping_key'] = termResponse?.data_obs;
			//send cmp key to props
			getInitTerms && getInitTerms(termResponse)
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

	const fetchData = async () => {
		op.platform = getOS() || '';
		op.browser = getBrowser() || '';
		const termResponse = await getTerms(op);
		if (termResponse) {
			setCmpKey(termResponse?.data_obs);
			// op['mapping_key'] = termResponse?.data_obs;
			//send cmp key to props
			getInitTerms && getInitTerms(termResponse)
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
		Object.values(checkProperty).map((ele) => {
			setCheckProperty(prev => {
				return ({
					...prev,
					[ele.property_id]: {
						...prev[ele.property_id],
						error_message: prev[ele.property_id].property_value ? '' : variablesObj?.[ele.property_name].errorMessage
					}
				})
			})
		})
		let checkPropertyCheck = Object.values(checkProperty).every(value => value.property_value);
		return checkPropertyCheck;
	}

	const handleChange = (event, checkboxId) => {
		const { value, checked } = event.target;

		if (checkboxId) {
			checkProperty[checkboxId].property_value = checked;
			checkProperty[checkboxId].error_message = checked ? '' : variablesObj?.[checkProperty[checkboxId].property_name].errorMessage;
		};

		handleOnChangeCheckbox && handleOnChangeCheckbox(checkProperty);

		if (value === 'isAcceptByParent') {
			setSelectedCMP(selectedCMP.length === termName.length ? [] : termName);
			Object.keys(checkProperty).forEach((key) => {
				console.log('key', checkProperty[key])
				console.log('key.property_name', checkProperty[key.property_name])
				checkProperty[key].property_value = checked ? true : false;
				checkProperty[key].error_message = checked ? '' : variablesObj?.[checkProperty[key].property_name].errorMessage
			});

			handleOnChangeCheckbox && handleOnChangeCheckbox(checkProperty);
			return;
		}
		const list = [...selectedCMP];
		const index = list.indexOf(value);
		index === -1 ? list.push(value) : list.splice(index, 1);
		setSelectedCMP(list);
	};

	const hadleClickLinkChild = (event, val) => {
		if (handleLinkClick) {
			if (event.target.tagName === 'A') {
				event.stopPropagation();
				event.preventDefault();
				handleLinkClick(val);
			}
		}
	}

	const callApiConsents = async (userInforId = 0) => {
		try {
			let isCmpValid = checkCMPValid();
			if (!isFormValid || !isCmpValid) return;
			op.cmp_properties = checkProp2cmpProp(checkProperty);
			op.mapping_key = cmpKey;
			op.extend_uid = userInforId.toString();
			const postConsentRespone = await postConsents(op);
			if (postConsentRespone?.statusCode === -103) throw postConsentRespone;
			setShowError('');
			return postConsentRespone?.data;
		} catch (error) {
			console.log(error);
			setShowError(error?.message);
			return null;
		}
	}

	useImperativeHandle(ref, () => ({
		callApiConsents,
		checkCMPValid,
		callApiGetTerms
	}))



	useEffect(() => {
		fetchData();
		return () => {
			fetchData();
		}
	}, []);


	return (
		<div ref={ref} className={classes}>
			{!hideCheckAll && <CmpChild className="cmp-adtima-checkox-all">
				<CustomCheckbox
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
					return (
						<div key={`checkbox_${valueTerm._id}`} className="cmp-adtima-group-child">
							<CmpChild className='cmp-adtima-child'>
								<CustomCheckbox
									id={`checkbox_${valueTerm._id}`}
									name={valueTerm?._id}
									type="checkbox"
									className="cmp-adtima-checkbox"
									value={valueTerm?._id}
									onChange={(e) => handleChange(e, valueTerm?._id)}
									checked={selectedCMP.includes(valueTerm?._id)}
								/>
								<CustomCheckboxLabel htmlFor={`checkbox_${valueTerm._id}`} className="cmp-adtima-label-wrap" onClick={(event) => hadleClickLinkChild(event, valueTerm)} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(variablesObj?.[valueTerm?.name].labelText) }}>

								</CustomCheckboxLabel>
							</CmpChild>
							{!checkProperty?.[valueTerm?._id]?.property_value && <ErrorMessage className="cmp-adtima-error-message">{checkProperty?.[valueTerm?._id]?.error_message}</ErrorMessage>}

						</div>
					)
				})}
			</CmpGroup>
			{showErrors && <ErrorMessage className="cmp-adtima-error-message">{showErrors}</ErrorMessage>}
		</div>
	)
})

export default CMP;
