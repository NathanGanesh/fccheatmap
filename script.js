(async () => {
	try {
		const jsonResponse = await d3.json(
			'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
		);
		const dataset = jsonResponse['monthlyVariance'];
		const baseTemp = jsonResponse['baseTemperature'];
		//width, heigth of the model
		const w = 800;
		const h = 600;
		//padding
		const padding = 60;
		console.log(jsonResponse);

		// for (let index = 0; index < dataset.length; index++) {
		// 	console.log(dataset[index]['year']);
		// }

		let minYear = d3.min(dataset, (item) => {
			return item['year'];
		});
		let maxYear = d3.max(dataset, (item) => {
			return item['year'];
		});
		const xTimeScale = d3
			.scaleLinear()
			.domain([
				d3.min(dataset, (item) => {
					return item['year'];
				}),
				d3.max(dataset, (item) => {
					return item['year'] + 1;
				})
			])
			.range([ padding, w - padding ]);

		const yDateScale = d3
			.scaleTime()
			.domain([ new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0) ])
			.range([ padding, h - padding ]);

		const heightScale = d3
			.scaleLinear()
			.domain([
				0,
				d3.max(dataset, (d) => {
					return [ 'month' ];
				})
			])
			.range([ 0, h - 2 * padding ]);

		const xScaleForBarsWidth = d3.scaleLinear().domain([ 0, dataset.length - 1 ]).range([ padding, w - padding ]);

		const svg = d3.select('#canvas').attr('width', w).attr('height', h);

		svg
			.selectAll('rect')
			.data(dataset)
			.enter()
			.append('rect')
			.attr('class', 'cell')
			.attr('width', (d) => {
				let numberOfYears = maxYear - minYear;
				return (w - 2 * padding) / numberOfYears;
			})
			.attr('data-month', (d) => {
				return d['month'] - 1;
			})
			.attr('data-year', (d) => {
				return d['year'];
			})
			.attr('data-temp', (d) => {
				return baseTemp + d['variance'];
			})
			.attr('height', (h - 2 * padding) / 12)
			.attr('x', (d, index) => {
				return xScaleForBarsWidth(index);
			})
			.attr('y', (d) => {
				return yDateScale(new Date(0, d['month'] - 1, 0, 0, 0, 0, 0));
			})
			.attr('fill', (item) => {
				let variance = item['variance'];
				if (variance <= -1) {
					return 'SteelBlue';
				} else if (variance <= 0) {
					return 'LightSteelBlue';
				} else if (variance <= 1) {
					return 'Orange';
				} else {
					return 'Crimson';
				}
			})
			.on('mouseover', (item) => {
				tooltip.transition().style('visibility', 'visible');

				let monthNames = [
					'January',
					'February',
					'March',
					'April',
					'May',
					'June',
					'July',
					'August',
					'September',
					'October',
					'November',
					'December'
				];

				tooltip.text(item['year'] + ' ' + monthNames[item['month'] - 1] + ' : ' + item['variance']);
				tooltip.attr('data-year', item['year']);
			})
			.on('mouseout', (item) => {
				tooltip.transition().style('visibility', 'hidden');
			});
		let tooltip = d3.select('#tooltip');

		const xAxis = d3.axisBottom(xTimeScale).tickFormat(d3.format('d'));

		const yAxis = d3.axisLeft(yDateScale).tickFormat(d3.timeFormat('%B'));

		svg.append('g').attr('transform', 'translate(0,' + (h - padding) + ')').attr('id', 'x-axis').call(xAxis);
		svg.append('g').attr('transform', 'translate(' + padding + ',0)').attr('id', 'y-axis').call(yAxis);
	} catch (error) {
		console.log(error);
	}
})();
