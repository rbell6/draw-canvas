import Brush from '../../../models/Brush';

const initialState = {
	size: Brush.sizes.M,
	color: Brush.colors[3].value,
	name: Brush.colors[3].label
};

export default function brush(state=initialState, action) {
	switch(action.type) {
		case 'SET_BRUSH_COLOR':
			return Object.assign({}, state, {
				color: action.color.value,
				name: action.color.label
			});
		case 'SET_BRUSH_SIZE':
			return Object.assign({}, state, {
				size: action.size
			});
		case 'SET_BRUSH_ERASER':
			return Object.assign({}, state, {
				name: 'eraser'
			});
		default:
			return state;
	}
}