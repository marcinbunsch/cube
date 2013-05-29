var tiers = module.exports = {};

var second = 1000,
    second10 = 10 * second,
    minute = 60 * second,
    minute5 = 5 * minute,
    minute15 = 15 * minute,
    minute30 = 30 * minute,
    hour = 60 * minute,
    day = 24 * hour,
    week = 7 * day;
    month = 4 * week,
    year = 12 * month;

var createTier = function(span) {
  tiers[span] = {
    key: span,
    floor: function(d) { return new Date(Math.floor(d / span) * span); },
    ceil: tier_ceil,
    step: function(d) { return new Date(+d + span); }
  };
}

createTier(second10);
createTier(minute);
createTier(minute5);
createTier(minute15);
createTier(minute30);

tiers[hour] = {
  key: hour,
  floor: function(d) { return new Date(Math.floor(d / hour) * hour); },
  ceil: tier_ceil,
  step: function(d) { return new Date(+d + hour); },
  next: tiers[minute5],
  size: function() { return 12; }
};

tiers[day] = {
  key: day,
  floor: function(d) { return new Date(Math.floor(d / day) * day); },
  ceil: tier_ceil,
  step: function(d) { return new Date(+d + day); },
  next: tiers[hour],
  size: function() { return 24; }
};

tiers[week] = {
  key: week,
  floor: function(d) { return new Date(Math.floor(d / week) * week); },
  ceil: tier_ceil,
  step: function(d) { return new Date(+d + week); },
  next: tiers[day],
  size: function() { return 7; }
};

tiers[month] = {
  key: month,
  floor: function(d) { return new Date(Math.floor(d / month) * month); },
  ceil: tier_ceil,
  step: function(d) { return new Date(+d + month); },
  next: tiers[week],
  size: function() { return 4; }
};

tiers[year] = {
  key: year,
  floor: function(d) { return new Date(Math.floor(d / year) * year); },
  ceil: tier_ceil,
  step: function(d) { return new Date(+d + year); },
  next: tiers[month],
  size: function() { return 12; }
};

function tier_ceil(date) {
  return this.step(this.floor(new Date(date - 1)));
}
