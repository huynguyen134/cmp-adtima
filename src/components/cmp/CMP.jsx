import React, { useState, useEffect } from 'react'
import { setCookie, checkProp2cmpProp, getBrowser, getOS, getTerms, postConsents, termProp2checkProp } from '../../helpers/utils';

import { CmpChild, CmpGroup, CustomCheckbox, CustomCheckboxLabel, ErrorMessage } from './styles'
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';


const CMP = (props) => {
	const { op, getInitTerms, getMapingKey, handleOnChangeCheckbox, submitCount, cmpValid = false, variablesObj, handleLinkClick, hideCheckAll = false, paddingChild
	} = props;
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
		op.platform = getOS() || '';
		op.browser = getBrowser() || '';
		console.log('initop, ', op)
		const termResponse = await getTerms(op);
		if (termResponse?.data_obs) {
			setCmpKey(termResponse?.data_obs);
			op['mapping_key'] = termResponse?.data_obs;
			//send cmp key to props
			console.log(termResponse?.data_obs)
			getInitTerms && getInitTerms(termResponse)
			getMapingKey && getMapingKey(termResponse?.data_obs)
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

	console.log('initop, ', op)
	console.log('termName', termName);

	const checkCMPValid = () => {
		return Object.values(checkProperty).every(value => value.property_value)
	}

	const handleChange = (event, checkboxId) => {
		const { value, checked } = event.target;
		// Update status property_value in TERM_CHECK_PROPERTY
		if (checkboxId) checkProperty[checkboxId].property_value = checked;
		console.log(checkProperty)

		handleOnChangeCheckbox && handleOnChangeCheckbox(checkProp2cmpProp(checkProperty));

		if (value === 'isAcceptByParent') {
			console.log('check all', selectedCMP)
			console.log('check all', termName)
			setSelectedCMP(selectedCMP.length === termName.length ? [] : termName);
			//  Update status property_value in TERM_CHECK_PROPERTY when check all
			Object.keys(checkProperty).forEach((key) => {
				checkProperty[key].property_value = checked ? true : false;
			});
			handleOnChangeCheckbox && handleOnChangeCheckbox(checkProp2cmpProp(checkProperty));

			//Check if CMP form valid or not
			cmpValid(checkCMPValid())
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
		cmpValid(checkCMPValid())


	};



	const hadleClickLinkChild = (event, val) => {
		if (event.target.tagName === 'A') {
			event.stopPropagation();
			event.preventDefault();
			console.log(event.target)
			console.log('tagName', event.target.tagName)
			handleLinkClick(val);
		};

	}

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
		// 	cmpValid(isCMPValid)

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
		<div id="adtima-cmp-wrapper">
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
							{!checkProperty?.[valueTerm?._id].property_value && submitCount > 0 && <ErrorMessage id={`cmp-error-message-${index}`}>{checkProperty?.[valueTerm?._id].error_message}</ErrorMessage>}
						</>
					)
				})}
			</CmpGroup>
		</div>
	)
}

export default CMP
