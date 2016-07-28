import find from 'lodash/find';

export function filterSensors(devices) {
  return devices.filter(
    ({ capabilities }) => capabilities && capabilities.indexOf('OCCUPANCY') !== -1
  );
}

export function transform({
  devices,
  data,
  originalDimension,
  displayDimension
}) {
  return devices.map(({ id, xLocation, yLocation }) => {
    const sensor = find(data, (sensorData) => sensorData.deviceId === id);

    return {
      x: Math.round(xLocation / originalDimension.w * displayDimension.w),
      y: Math.round(yLocation / originalDimension.h * displayDimension.h),
      value: (sensor && sensor.value > 10) ? Math.round(sensor.value) : 10
    };
  });
}
