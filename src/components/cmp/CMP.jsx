import React, { useState, useEffect } from 'react'
import { setCookie, checkProp2cmpProp, getBrowser, getOS, getTerms, postConsents, termProp2checkProp } from '../../helpers/utils';

import { CmpChild, CmpGroup, CustomCheckbox, CustomCheckboxLabel } from './styles'


const CMP = (props) => {
	const { op, isSubmit, getMapingKey, handleOnChangeCheckbox, errorMessage, submitCount, isCmpValidProps, variablesObj, handleLinkClick, isFormValid = false, isPostConsentsDone=false } = props;
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
			isCmpValidProps && isCmpValidProps(checkCMPValid())
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
		isCmpValidProps && isCmpValidProps(checkCMPValid())


	};


	const hadleClickLinkChild = (event, val) => {
		event.stopPropagation();
		event.preventDefault();
		handleLinkClick(val);
	}

	useEffect(() => {
		// if (submitCount > 0) {
		//     if (selectedCMP.length < 2) {
		//         setError('isAcceptByParent', { message: 'Vui lòng đồng ý để sử dụng dịch vụ' });

		//     } else { clearErrors('isAcceptByParent') }
		// }

	}, [selectedCMP])

	useEffect( async () => {
		if(isFormValid && checkCMPValid() ) {
			op.cmp_properties = checkProp2cmpProp(checkProperty);
			op.mapping_key = cmpKey;
			// console.log('op when valid form and cmp', op)
			const statusPostConsents = await postConsents(op);
			statusPostConsents.length ? isPostConsentsDone(true) : isPostConsentsDone(false);
		}
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
									<span>{variablesObj?.[valueTerm?.name].labelText}</span>
									{variablesObj?.[valueTerm?.name].link?.length &&  <a onClick={(event)=> hadleClickLinkChild(event, valueTerm)} >{variablesObj?.[valueTerm?.name].labelText}</a>}
								
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
