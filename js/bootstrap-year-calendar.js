/* =========================================================
 * bootstrap-simple-calender.js
 * Repo: https://github.com/Paul-DS/bootstrap-simple-calendar
 * =========================================================
 * Created by Paul David-Sivelle
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */
 
 (function($) {
	var Calendar = function(element, options) {
		this.element = element;
		this.element.addClass('calendar');
		
		this._initializeOptions(options);
		this._render();
	};
 
	Calendar.prototype = {
		constructor: Calendar,
		_initializeOptions(opt) {
			if(opt == null) {
				opt = [];
			}
		
			this.options = {
				startYear: opt.startYear != null ? opt.startYear : new Date().getFullYear(),
				minDate: opt.minDate,
				maxDate: opt.maxDate,
				language: opt.language != null ? opt.language : 'en',
				allowOverlap: opt.allowOverlap != null ? opt.allowOverlap : true,
				displayWeekNumber: opt.displayWeekNumber != null ? opt.displayWeekNumber : false,
				dataSource: opt.dataSource != null ? opt.dataSource : [],
				style: opt.style != null ? opt.style : 'border',
				contextMenuEnabled: opt.contextMenuEnabled != null ? opt.contextMenuEnabled : false,
				contextMenuItems: opt.contextMenuItems != null ? opt.contextMenuItems : [],
				/* Events */
				renderDay: opt.renderDay,
				clickDate: opt.clickDate,
				contextMenu: opt.contextMenu,
				selectRange: opt.selectRange,
				mouseOnDate: opt.mouseOnDate,
				mouseOutDate: opt.mouseOutDate
			};
			
			this._initializeDatasourceColors();
		},
		_initializeDatasourceColors: function() {
			for(var i in this.options.dataSource) {
				if(this.options.dataSource[i].color == null) {
					this.options.dataSource[i].color = colors[i % colors.length];
				}
			}
		},
		_render: function() {
			this.element.empty();
			
			this._renderHeader();
			this._renderBody();
			this._renderDataSource();
			
			this._applyEvents();
			this.element.find('.months-container').fadeIn(500);
		},
		_renderHeader: function() {
			var header = $(document.createElement('div'));
			header.addClass('calendar-header panel panel-default');
			
			var headerTable = $(document.createElement('table'));
			
			var prevDiv = $(document.createElement('th'));
			prevDiv.addClass('prev');
			
			if(this.options.minDate != null && this.options.minDate > new Date(this.options.startYear - 1, 11, 31)) {
				prevDiv.addClass('disabled');
			}
			
			var prevIcon = $(document.createElement('span'));
			prevIcon.addClass('glyphicon glyphicon-chevron-left');
			
			prevDiv.append(prevIcon);
			
			headerTable.append(prevDiv);
			
			var prev2YearDiv = $(document.createElement('th'));
			prev2YearDiv.addClass('year-title year-neighbor2 hidden-sm hidden-xs');
			prev2YearDiv.text(this.options.startYear - 2);
			
			if(this.options.minDate != null && this.options.minDate > new Date(this.options.startYear - 2, 11, 31)) {
				prev2YearDiv.addClass('disabled');
			}
			
			headerTable.append(prev2YearDiv);
			
			var prevYearDiv = $(document.createElement('th'));
			prevYearDiv.addClass('year-title year-neighbor hidden-xs');
			prevYearDiv.text(this.options.startYear - 1);
			
			if(this.options.minDate != null && this.options.minDate > new Date(this.options.startYear - 1, 11, 31)) {
				prevYearDiv.addClass('disabled');
			}
			
			headerTable.append(prevYearDiv);
			
			var yearDiv = $(document.createElement('th'));
			yearDiv.addClass('year-title');
			yearDiv.text(this.options.startYear);
			
			headerTable.append(yearDiv);
			
			var nextYearDiv = $(document.createElement('th'));
			nextYearDiv.addClass('year-title year-neighbor hidden-xs');
			nextYearDiv.text(this.options.startYear + 1);
			
			if(this.options.maxDate != null && this.options.maxDate < new Date(this.options.startYear + 1, 0, 1)) {
				nextYearDiv.addClass('disabled');
			}
			
			headerTable.append(nextYearDiv);
			
			var next2YearDiv = $(document.createElement('th'));
			next2YearDiv.addClass('year-title year-neighbor2 hidden-sm hidden-xs');
			next2YearDiv.text(this.options.startYear + 2);
			
			if(this.options.maxDate != null && this.options.maxDate < new Date(this.options.startYear + 2, 0, 1)) {
				next2YearDiv.addClass('disabled');
			}
			
			headerTable.append(next2YearDiv);
			
			var nextDiv = $(document.createElement('th'));
			nextDiv.addClass('next');
			
			if(this.options.maxDate != null && this.options.maxDate < new Date(this.options.startYear + 1, 0, 1)) {
				nextDiv.addClass('disabled');
			}
			
			var nextIcon = $(document.createElement('span'));
			nextIcon.addClass('glyphicon glyphicon-chevron-right');
			
			nextDiv.append(nextIcon);
			
			headerTable.append(nextDiv);
			
			header.append(headerTable);
			
			this.element.append(header);
		},
		_renderBody: function() {
			var monthsDiv = $(document.createElement('div'));
			monthsDiv.addClass('months-container');
			
			for(var m = 0; m < 12; m++) {
				/* Container */
				var monthDiv = $(document.createElement('div'));
				monthDiv.addClass('month-container');
				monthDiv.data('month-id', m);
				
				var firstDate = new Date(this.options.startYear, m, 1);
				
				var table = $(document.createElement('table'));
				table.addClass('month');
				
				/* Month header */
				var thead = $(document.createElement('thead'));
				
				var titleRow = $(document.createElement('tr'));
				
				var titleCell = $(document.createElement('th'));
				titleCell.addClass('month-title');
				titleCell.attr('colspan', this.options.displayWeekNumber ? 8 : 7);
				titleCell.text(dates[this.options.language].months[m]);
				
				titleRow.append(titleCell);
				thead.append(titleRow);
				
				var headerRow = $(document.createElement('tr'));
				
				if(this.options.displayWeekNumber) {
					var weekNumberCell = $(document.createElement('th'));
					weekNumberCell.addClass('week-number');
					weekNumberCell.text('W')
					headerRow.append(weekNumberCell);
				}
				
				var d = dates[this.options.language].weekStart;
				do
				{
					var headerCell = $(document.createElement('th'));
					headerCell.addClass('day-header');
					headerCell.text(dates[this.options.language].daysMin[d]);
					
					headerRow.append(headerCell);
					
					d++;
					if(d >= 7)
						d = 0;
				}
				while(d != dates[this.options.language].weekStart)
				
				thead.append(headerRow);
				table.append(thead);
				
				/* Days */
				var currentDate = new Date(firstDate.getTime());
				var lastDate = new Date(this.options.startYear, m + 1, 0);
				
				var weekStart = dates[this.options.language].weekStart
				
				while(currentDate.getDay() != weekStart)
				{
					currentDate.setDate(currentDate.getDate() - 1);
				}
				
				while(currentDate < lastDate)
				{
					var row = $(document.createElement('tr'));
					
					if(this.options.displayWeekNumber) {
						var weekNumberCell = $(document.createElement('td'));
						weekNumberCell.addClass('week-number');
						weekNumberCell.text(this.getWeekNumber(currentDate));
						row.append(weekNumberCell);
					}
				
					do
					{
						var cell = $(document.createElement('td'));
						cell.addClass('day');
						
						if(currentDate < firstDate) {
							cell.addClass('old');
						}
						else if(currentDate > lastDate) {
							cell.addClass('new');
						}
						else {
							if((this.options.minDate != null && currentDate < this.options.minDate) || (this.options.maxDate != null && currentDate > this.options.maxDate))
							{
								cell.addClass('disabled');
							}
						
							var cellContent = $(document.createElement('div'));
							cellContent.addClass('day-content');
							cellContent[0].innerText = currentDate.getDate();
							cell.append(cellContent);
						}
						
						row.append(cell);
						
						currentDate.setDate(currentDate.getDate() + 1);
					}
					while(currentDate.getDay() != weekStart)
					
					table.append(row);
				}
				
				monthDiv.append(table);
				
				monthsDiv.append(monthDiv);
			}
			
			this.element.append(monthsDiv);
		},
		_renderDataSource: function() {
			var _this = this;
			if(this.options.dataSource != null && this.options.dataSource.length > 0) {
				this.element.find('.month-container').each(function() {
					var month = $(this).data('month-id');
					
					var firstDate = new Date(_this.options.startYear, month, 1);
					var lastDate = new Date(_this.options.startYear, month + 1, 0);
					
					if((_this.options.minDate == null || lastDate >= _this.options.minDate) && (_this.options.maxDate == null || firstDate <= _this.options.maxDate))
					{
						var monthData = [];
					
						for(var i in _this.options.dataSource) {
							if(!(_this.options.dataSource[i].startDate > lastDate) || (_this.options.dataSource[i].endDate < firstDate)) {
								monthData.push(_this.options.dataSource[i]);
							}
						}
						
						if(monthData.length > 0) {
							$(this).find('.day-content').each(function() {
								var currentDate = new Date(_this.options.startYear, month, $(this).text());
								
								var dayData = [];
								
								if((_this.options.minDate == null || currentDate >= _this.options.minDate) && (_this.options.maxDate == null || currentDate <= _this.options.maxDate))
								{
									for(var i in monthData) {
										if(monthData[i].startDate <= currentDate && monthData[i].endDate >= currentDate) {
											dayData.push(monthData[i]);
										}
									}
									
									if(dayData.length > 0)
									{
										_this._renderDataSourceDay($(this), dayData);
									}
								}
							});
						}
					}
				});
			}
		},
		_renderDataSourceDay: function(elt, events) {
			switch(this.options.style)
			{
				case 'border':
					var weight = 0;
			
					if(events.length == 1) {
						weight = 4;
					}
					else if(events.length <= 3) {
						weight = 2;
					}
					else {
						elt.parent().css('box-shadow', 'inset 0 -4px 0 0 black');
					}
					
					if(weight > 0)
					{
						var boxShadow = '';
					
						for(var i in events)
						{
							if(boxShadow != '') {
								boxShadow += ",";
							}
							
							boxShadow += 'inset 0 -' + (parseInt(i) + 1) * weight + 'px 0 0 ' + events[i].color;
						}
						
						elt.parent().css('box-shadow', boxShadow);
					}
					break;
			
				case 'background':
					elt.parent().css('background-color', events[events.length - 1].color);
					break;
			}
		},
		_applyEvents: function () {
			var _this = this;
			
			/* Header buttons */
			this.element.find('.year-neighbor, .year-neighbor2').click(function() {
				if(!$(this).hasClass('disabled')) {
					_this.setYear(parseInt($(this).text()));
				}
			});
			
			this.element.find('.calendar-header .prev').click(function() {
				if(!$(this).hasClass('disabled')) {
					_this.element.find('.months-container').animate({'margin-left':'100%'},100, function() {
						_this.element.find('.months-container').hide();
						_this.element.find('.months-container').css('margin-left', '0');
						setTimeout(function() { _this.setYear(_this.options.startYear - 1) }, 50);
					});
				}
			});
			
			this.element.find('.calendar-header .next').click(function() {
				if(!$(this).hasClass('disabled')) {
					_this.element.find('.months-container').animate({'margin-left':'-100%'},100, function() {
						_this.element.find('.months-container').hide();
						_this.element.find('.months-container').css('margin-left', '0');
						setTimeout(function() { _this.setYear(_this.options.startYear + 1) }, 50);
					});
				}
			});
			
			var cells = this.element.find('.day:not(.old, .new, .disabled)');
			
			/* Day rendering */
			if(this.options.renderDay) {
				this.element.find('.month-container').each(function() {
					var month = $(this).data('month-id');
					$(this).find('.day-content').each(function() {
						_this.options.renderDay({
							element: $(this),
							date: new Date(_this.options.startYear, month, $(this).text())
						});
					});
				});
			}
			
			/* Click on date */
			if(this.options.clickDate) {
				cells.click(function(e) {
					e.stopPropagation();
					var date = _this._getDate($(this));
					_this.options.clickDate({
						element: $(this),
						which: e.which,
						date: date,
						events: _this.getEvents(date)
					});
				});
			}
			
			/* Click right on date */
			if(this.options.contextMenuEnabled) {
				cells.bind('contextmenu', function(e) {
					e.preventDefault();
					if(_this.options.contextMenu)
					{
						var date = _this._getDate($(this));
						_this.options.contextMenu({
							element: $(this),
							date: date,
							events: _this.getEvents(date)
						});
					}
					else
					{
						_this._openContextMenu($(this));
					}
				});
			}
			
			/* Range selection */
			if(this.options.selectRange) {
				cells.mousedown(function (e) {
					if(e.which == 1) {
						var currentDate = _this._getDate($(this));
					
						if(_this.options.allowOverlap || _this.getEvents(currentDate).length == 0)
						{
							_this._mouseDown = true;
							_this._rangeStart = _this._rangeEnd = currentDate;
							_this._refreshRange();
						}
					}
				});

				cells.mouseenter(function (e) {
					if (_this._mouseDown) {
						var currentDate = _this._getDate($(this));
						
						if(!_this.options.allowOverlap)
						{
							var newDate =  new Date(_this._rangeStart.getTime());
							
							if(newDate < currentDate) {
								var nextDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + 1);
								while(newDate < currentDate) {
									if(_this.getEvents(nextDate).length > 0)
									{
										break;
									}
								
									newDate.setDate(newDate.getDate() + 1);
									nextDate.setDate(nextDate.getDate() + 1);
								}
							}
							else {
								var nextDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() - 1);
								while(newDate > currentDate) {
									if(_this.getEvents(nextDate).length > 0)
									{
										break;
									}
								
									newDate.setDate(newDate.getDate() - 1);
									nextDate.setDate(nextDate.getDate() - 1);
								}
							}
							
							currentDate = newDate;
						}
					
						var oldValue = _this._rangeEnd;
						_this._rangeEnd = currentDate;

						if (oldValue.getTime() != _this._rangeEnd.getTime()) {
							_this._refreshRange();
						}
					}
				});

				$(window).mouseup(function (e) {
					if (_this._mouseDown) {
						_this._mouseDown = false;
						_this._refreshRange();

						var minDate = _this._rangeStart < _this._rangeEnd ? _this._rangeStart : _this._rangeEnd;
						var maxDate = _this._rangeEnd > _this._rangeStart ? _this._rangeEnd : _this._rangeStart;

						_this.options.selectRange({ startDate: minDate, endDate: maxDate });
					}
				});
			}
		
			/* Hover date */
			if(this.options.mouseOnDate) {
				cells.mouseenter(function(e) {
					if(!_this._mouseDown)
					{
						var date = _this._getDate($(this));
						_this.options.mouseOnDate({
							element: $(this),
							date: date,
							events: _this.getEvents(date)
						});
					}
				});
			}
			
			if(this.options.mouseOutDate) {
				cells.mouseleave(function(e) {
					var date = _this._getDate($(this));
					_this.options.mouseOutDate({
						element: $(this),
						date: date,
						events: _this.getEvents(date)
					});
				});
			}
			
			/* Responsive management */
			
			setInterval(function() {
				var calendarSize = $(_this.element).width();
				var monthSize = $(_this.element).find('.month').first().width() + 10;
				var monthContainerClass = 'month-container';
				
				if(monthSize * 6 < calendarSize) {
					monthContainerClass += ' col-xs-2';
				}
				else if(monthSize * 4 < calendarSize) {
					monthContainerClass += ' col-xs-3';
				}
				else if(monthSize * 3 < calendarSize) {
					monthContainerClass += ' col-xs-4';
				}
				else if(monthSize * 2 < calendarSize) {
					monthContainerClass += ' col-xs-6';
				}
				else {
					monthContainerClass += ' col-xs-12';
				}
				
				$(_this.element).find('.month-container').attr('class', monthContainerClass);
			}, 300);
		},
		_refreshRange: function () {
			var _this = this;
		
            this.element.find('td.day.range').removeClass('range')
            this.element.find('td.day.range-start').removeClass('range-start');
            this.element.find('td.day.range-end').removeClass('range-end');

            if (this._mouseDown) {
                var beforeRange = true;
                var afterRange = false;
                var minDate = _this._rangeStart < _this._rangeEnd ? _this._rangeStart : _this._rangeEnd;
                var maxDate = _this._rangeEnd > _this._rangeStart ? _this._rangeEnd : _this._rangeStart;

                this.element.find('.month-container').each(function () {
					var monthId = $(this).data('month-id');
                    if (minDate.getMonth() <= monthId && maxDate.getMonth() >= monthId) {
                        $(this).find('td.day:not(.old, .new)').each(function () {
                            var date = _this._getDate($(this));
                            if (date >= minDate && date <= maxDate) {
                                $(this).addClass('range');

                                if (date.getTime() == minDate.getTime()) {
                                    $(this).addClass('range-start');
                                }

                                if (date.getTime() == maxDate.getTime()) {
                                    $(this).addClass('range-end');
                                }
                            }
                        });
                    }
                });
            }
        },
		_openContextMenu: function(elt) {
			var contextMenu = $('.calendar-context-menu');
			
			if(contextMenu.length > 0) {
				contextMenu.hide();
				contextMenu.empty();
			}
			else {
				contextMenu = $(document.createElement('div'));
				contextMenu.addClass('calendar-context-menu');
				$('body').append(contextMenu);
			}
			
			var date = this._getDate(elt);
			var events = this.getEvents(date);
			
			for(var i in events) {
				var eventItem = $(document.createElement('div'));
				eventItem.addClass('item');
				eventItem.css('border-left', '4px solid ' + events[i].color);
				
				var eventItemContent = $(document.createElement('div'));
				eventItemContent.addClass('content');
				eventItemContent.text(events[i].name);
				
				eventItem.append(eventItemContent);
				
				var icon = $(document.createElement('span'));
				icon.addClass('glyphicon glyphicon-chevron-right');
				
				eventItem.append(icon);
				
				this._renderContextMenuItems(eventItem, this.options.contextMenuItems, events[i]);
				
				contextMenu.append(eventItem);
			}
			
			if(contextMenu.children().length > 0)
			{
				contextMenu.css('left', elt.offset().left + 25 + 'px');
				contextMenu.css('top', elt.offset().top + 25 + 'px');
				contextMenu.show();
				
				$(window).one('mouseup', function() {
					contextMenu.hide();
				});
			}
		},
		_renderContextMenuItems: function(parent, items, evt) {
			var subMenu = $(document.createElement('div'));
			subMenu.addClass('submenu');
			
			for(var i in items) {
				if(!items[i].visible || items[i].visible(evt)) {
					var menuItem = $(document.createElement('div'));
					menuItem.addClass('item');
					
					var menuItemContent = $(document.createElement('div'));
					menuItemContent.addClass('content');
					menuItemContent.text(items[i].text);
					
					menuItem.append(menuItemContent);
					
					if(items[i].click) {
						(function(index) {
							menuItem.click(function() {
								items[index].click(evt);
							});
						})(i);
					}
					
					var icon = $(document.createElement('span'));
					icon.addClass('glyphicon glyphicon-chevron-right');
					
					menuItem.append(icon);
					
					if(items[i].items && items[i].items.length > 0) {
						this._renderContextMenuItems(menuItem, items[i].items, evt);
					}
					
					subMenu.append(menuItem);
				}
			}
			
			if(subMenu.children().length > 0)
			{
				parent.append(subMenu);
			}
		},
		_getColor: function(colorString) {
			var div = $('<div />');
			div.css('color', colorString);
			
		},
		_getDate: function(elt) {
			var day = elt.children('.day-content').text();
			var month = elt.closest('.month-container').data('month-id');
			var year = this.options.startYear;

			return new Date(year, month, day);
		},
		getWeekNumber: function(date) {
			var tempDate = new Date(date.getTime());
			tempDate.setHours(0, 0, 0, 0);
			tempDate.setDate(tempDate.getDate() + 3 - (tempDate.getDay() + 6) % 7);
			var week1 = new Date(tempDate.getFullYear(), 0, 4);
			return 1 + Math.round(((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
		},
		getEvents: function(date) {
			var events = [];
			
			if(this.options.dataSource && date) {
				for(var i in this.options.dataSource) {
					if(this.options.dataSource[i].startDate <= date && this.options.dataSource[i].endDate >= date) {
						events.push(this.options.dataSource[i]);
					}
				}
			}
			
			return events;
		},
		getYear: function() {
			return this.options.startYear;
		},
		setYear: function(year) {
			this.options.startYear = year;
			this._render();
		},
		getMinDate: function() {
			return this.options.minDate;
		},
		setMinDate: function(date) {
			this.options.minDate = date;
			this._render();
		},
		getMaxDate: function() {
			return this.options.maxDate;
		},
		setMaxDate: function(date) {
			this.options.maxDate = date;
			this._render();
		},
		getStyle: function() {
			return this.options.style;
		},
		setStyle: function(style) {
			this.options.style = style;
			this._render();
		},
		getAllowOverlap: function() {
			return this.options.allowOverlap;
		},
		setAllowOverlap: function(allowOverlap) {
			this.options.allowOverlap = allowOverlap;
		},
		getLanguage: function() {
			return this.options.language;
		},
		setLanguage: function(language) {
			this.options.language = language;
			this._render();
		},
		getDataSource: function() {
			return this.options.dataSource;
		},
		setDataSource: function(dataSource) {
			this.options.dataSource = dataSource;
			this._initializeDatasourceColors();
			this._render();
		},
		addEvent: function(evt) {
			this.options.dataSource.push(evt);
			this._render();
		}
	}
 
	$.fn.calendar = function (options) {
		var calendar = new Calendar($(this) ,options);
		$(this).data('calendar', calendar);
	}
	
	var dates = $.fn.calendar.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			weekStart:0
		}
	};
	
	var colors = $.fn.calendar.colors = ['#2C8FC9', '#9CB703', '#F5BB00', '#FF4A32', '#B56CE2', '#45A597'];
	
	$(function(){
		$('[data-provide="calendar"]').each(function() {
			$(this).calendar();
		});
	});
 }(window.jQuery));
