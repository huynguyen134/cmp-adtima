import React, { useState, useEffect } from 'react'
import { setCookie, checkProp2cmpProp, getBrowser, getOS, getTerms, postConsents, termProp2checkProp } from '../../helpers/utils';
import { getKeyFormByName } from '../../helpers/common';

import { CmpChild, CmpGroup, CustomCheckbox, CustomCheckboxLabel } from './styles'


const CMP = (props) => {
	const { op, isSubmit, getMapingKey} = props;
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
				setValue.add(getKeyFormByName(ele.name));
				return setTermName([...setValue]);
			});
		}
	};

	const fetchData = async () => {
		const termResponse = await getTerms(op);
		if (termResponse?.data_obs) {
			setCmpKey(termResponse?.data_obs);
			op['mapping_key'] = termResponse?.data_obs;
			console.log('termResponse?.data_ob', termResponse)
			getMapingKey(termResponse?.data_obs)
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

	const handleChange = (event, checkboxId) => {
		const { value, checked } = event.target;
		// Update status property_value in TERM_CHECK_PROPERTY
		if (checkboxId) checkProperty[checkboxId].property_value = checked;
		// if (checked) {
		//   setValue(value, true);
		//   clearErrors(value);
		// } else {
		//   setValue(value, false);
		//   if (formState.submitCount > 0) {
		//     setError(value, { message: REGISTER_FORM_VALIDATES?.[value].required });
		//   }
		// }

		if (value === 'isAcceptByParent') {
			console.log('check all', selectedCMP)
			console.log('check all', termName)
			setSelectedCMP(selectedCMP.length === termName.length ? [] : termName);
			//  Update status property_value in TERM_CHECK_PROPERTY when check all
			Object.keys(checkProperty).forEach((key) => {
				checkProperty[key].property_value = checked ? true : false;
			});
		
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


	};
	console.log('selectedCMP', selectedCMP)


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
		//     if (selectedCMP.length < 2) {
		//         setError('isAcceptByParent', { message: 'Vui lòng đồng ý để sử dụng dịch vụ' });

		//     } else { clearErrors('isAcceptByParent') }
		// }

		
	
		if(!form1Valid) return;




	}, [isSubmit])

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
					let nameCheckbox = getKeyFormByName(valueTerm?.name);
					return (
						<CmpChild key={`checkbox_${index}`}>
							<CustomCheckbox
								id={`checkbox_${valueTerm._id}`}
								name={nameCheckbox}
								type="checkbox"
								// {...register(nameCheckbox, { ...REGISTER_FORM_VALIDATES[nameCheckbox] })}
								value={nameCheckbox}
								onChange={(e) => handleChange(e, 'checkbox_' + valueTerm._id)}
								checked={selectedCMP.includes(nameCheckbox)}
							/>
							<CustomCheckboxLabel htmlFor={`checkbox_${valueTerm._id}`}>{handleConvertCMPLabel(valueTerm?.permission_set, valueTerm?.values[0]?.value_consent
							)}</CustomCheckboxLabel>
						</CmpChild>
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
