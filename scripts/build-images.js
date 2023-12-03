const exif = require('exif');
const fs = require('fs');
const path = require('path');

const PATH_IMAGES = 'src/assets/images';
const PATH_IMAGE_INFO = 'src/assets/images.json';


async function getExifData(path) {
  return new Promise((resolve, reject) => {
    new exif.ExifImage(path, (error, exifData) => {
      if(error) {
        reject(error);
      } else {
        resolve(exifData);
      }
    });
  });
}


function parseExifDateTime(s) {
  const match = s.match(/(\d\d\d\d):(\d\d):(\d\d) (\d\d):(\d\d):(\d\d)/)
  return new Date(Date.UTC(match[1], match[2] - 1, match[3], match[4], match[5], match[6]));
}


function parseExifLatLon(amplitude, ref) {
  let pos = amplitude[0] + amplitude[1] / 60 + amplitude[2] / 3600;
  if(ref === 'S' || ref === 'W') {
    pos *= -1;
  }
  return pos;
}


async function getImages(travelId) {
  const pathImages = path.join(PATH_IMAGES, travelId);
  const filenames = fs.readdirSync(pathImages);
  const images = [];
  for(const filename of filenames) {
    const pathImage = path.join(pathImages, filename);
    const exifData = await getExifData(pathImage);
    const image = {
      filename: filename,
      width: exifData.exif.ExifImageWidth,
      height: exifData.exif.ExifImageHeight,
      dateCreated: parseExifDateTime(exifData.exif.CreateDate),
    };
    if(exifData.gps?.GPSLatitude && exifData.gps?.GPSLongitude) {
      image.lat = parseExifLatLon(exifData.gps.GPSLatitude, exifData.gps.GPSLatitudeRef);
      image.lng = parseExifLatLon(exifData.gps.GPSLongitude, exifData.gps.GPSLongitudeRef);
    }
    images.push(image);
  }

  images.sort((i1, i2) => i1.dateCreated.getTime() - i2.dateCreated.getTime());

  return images;
}


async function main() {
  const travelIds = fs.readdirSync(PATH_IMAGES);

  const images = {};
  for(const travelId of travelIds) {
    images[travelId] = await getImages(travelId);
  }

  const data = JSON.stringify(images);
  fs.writeFileSync(PATH_IMAGE_INFO, data);
}


main();
