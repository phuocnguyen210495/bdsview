import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpsServiceService} from '../service/https-service.service';
import {environment} from '../../environments/environment.prod';
import * as $ from 'jquery';
import {MatDialogRef} from '@angular/material';

declare const PANOLENS: any;
declare const THREE: any;
const IMAGE_API = environment.apiEndpoint + '/api/image';
const HOTPOT_API = environment.apiEndpoint + '/api/hotPot';
const TARGET_IMG = 'data:image/png;base64,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';

@Component({
  selector: 'app-vr360-image',
  templateUrl: './vr360-image.component.html',
  styleUrls: ['./vr360-image.component.css']
})
export class Vr360ImageComponent implements OnInit, OnDestroy {
  viewer: any;
  imageList: Array<any>;
  rootImageId: number;
  linkedImageId: number;

  constructor(private httpService: HttpsServiceService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log('after');
    this.httpService.getAll(IMAGE_API).subscribe(data => {
      this.viewer = new PANOLENS.Viewer();
      this.imageList = data;
      this.imageList.forEach((image, index) => {
        this.imageList[index].panorama = new PANOLENS.ImagePanorama(image.image);
        this.viewer.add(this.imageList[index].panorama);
      });
      this.rootImageId = 0;
      this.linkedImageId = 1;
      this.imageList.forEach((image, index) => {
        this.setHotPot(index);
      });
      this.viewer.setPanorama(this.imageList[0].panorama);
      this.viewer.onWindowResize(this.viewer.container._width, this.viewer.container._height);
      console.log(data);
      console.log('loading complete');
    });

  }

  setHotPot(idImage) {
    this.imageList[idImage].hotPotList.forEach(hotpot => {
      let filtered = this.imageList.filter(function(el) {
        return el.id === hotpot.linkedImage.id;
      });
      this.imageList[idImage].panorama.link(filtered[0].panorama, new THREE.Vector3(hotpot.xIndex, hotpot.yIndex, hotpot.zIndex), hotpot.imgScale, TARGET_IMG);
    });
  }

  ngOnDestroy(): void {
    $('.panolens-container').remove();
  }
}