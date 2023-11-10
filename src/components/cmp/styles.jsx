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
	border: var(--cmp-border-checkbox-width, 1px) solid var(--cmp-checkbox-border-normal-color, #000);
	border-radius: var(--cmp-bg-checkbox-border-radius, 2px);;
	background: var(--cmp-bg-checkbox-normal-color, #fff);
	cursor: pointer;
	line-height: 0;
	margin: 0 .6em 0 0;
	outline: 0;
	padding: 0 !important;
	vertical-align: text-top;
	height: var(--cmp-checkbox-height, 20px);
	width: var(--cmp-checkbox-width, 20px);
	min-width: var(--cmp-checkbox-width, 20px);
	align-self: flex-start;
    margin-top: 0.1rem;
	text-align: center;
	opacity: 1;
	
	&:hover {
		opacity: 1;
	}

	&:checked {
		background-color: var(--cmp-bg-checkbox-checked-color, #102dc3);
		opacity: 1;
		border-color: var(--cmp-checkbox-border-checked-color, #102dc3);
		&::before {
			content: '';
			position: absolute;
			right: 50%;
			top: 50%;
			width: 4px;
			height: 10px;
			border: solid var(--cmp-icon-checkbox-checked-color, #fff);
			border-width: 0 2px 2px 0;
			margin: -1px -1px 0 -1px;
			transform: rotate(45deg) translate(-50%, -50%);
			z-index: 2;
		}
	}


`

export const CustomCheckboxLabel = styled.label`
	text-align: left;
	&:hover {
		cursor: pointer;
	}
	.policy-link {
		color: var(--cmp-policy-link, #102dc3);
		text-decoration: underline;
	}
	
`

export const CmpGroup = styled.div`
	padding-left: ${props => props.padding + 'rem'};
`;


export const ErrorMessage = styled.div`
	text-align: left;
	color: var(--cmp-error-message-color, #ff0000);
`