import styled from 'styled-components';

export const CmpWrapper = styled.div`
  color: #BF4F74;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #BF4F74;
  border-radius: 3px;
`;

export const CmpChild = styled.div`
	display: flex;
	align-items: center;
	gap: .2rem;
	margin-top: .8rem;
`;

export const CustomCheckbox = styled.input.attrs({ type: 'checkbox' })`
	position: relative;
	-webkit-appearance: none;
	border: 2px solid var(--gray1, #000);
	border-radius: 2px;
	background: var(--cmp-bg-checkbox-normal, #fff);
	cursor: pointer;
	line-height: 0;
	margin: 0 .6em 0 0;
	outline: 0;
	padding: 0 !important;
	vertical-align: text-top;
	height: 20px;
	width: 20px;
	min-width: 20px;
	align-self: flex-start;
	text-align: center;
	opacity: 1;
	
	&:hover {
		opacity: 1;
	}

	&:checked {
		background-color: var(--cmp-bg-checkbox-checked, #102dc3);
		opacity: 1;
		border-color: var(--cmp-bg-checkbox-checked, #102dc3);
	}

	&::before {
		content: '';
		position: absolute;
		right: 50%;
		top: 50%;
		width: 4px;
		height: 10px;
		border: solid var(--cmp-icon-checkbox-checked, #fff);
		border-width: 0 2px 2px 0;
		margin: -1px -1px 0 -1px;
		transform: rotate(45deg) translate(-50%, -50%);
		z-index: 2;
	}
`

export const CustomCheckboxLabel = styled.label`
	&:hover {
		cursor: pointer;
	}
	.policy-link {
		color: var(--cmp-policy-link, #102dc3);
		text-decoration: underline;
	}
	
`

export const CmpGroup = styled.div`
	padding-left: ${props => props.padding + 'rem' || 0};
`;
