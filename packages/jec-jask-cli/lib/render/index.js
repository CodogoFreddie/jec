import windowSize from "window-size";

import processTasksForRendering from "./processTasksForRendering";
import generateColumnRenderingInfo from "./generateColumnRenderingInfo";
import renderTasksToString from "./renderTasksToString";

export default (function (config) {
	return function (tasks) {
		var _windowSize$get = windowSize.get(),
		    width = _windowSize$get.width,
		    height = _windowSize$get.height;

		var renderReadyTasks = processTasksForRendering({
			config: config,
			height: height
		})(tasks);

		var columnWidths = generateColumnRenderingInfo(config)(renderReadyTasks);

		return renderTasksToString({
			width: width,
			height: height,
			renderReadyTasks: renderReadyTasks,
			columnWidths: columnWidths
		});
	};
});