// import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
// import { Sort } from '@angular/material/sort';
// import { IComponent } from 'src/app/common/interfaces/component.interfact';
// import { IModel } from 'src/app/common/interfaces/model.interface';
// import { PropertyDataType } from 'src/app/enum/property-data-type.enum';
// import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
// import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
// import { PagedList } from 'src/app/network/entity/page.entity';
// import { PartialData, IPartialData } from 'src/app/network/entity/partial-data.interface';
// import { Property } from 'src/app/network/entity/property.entity';
// import { ProfilePropertyValueModel } from '../garbage-station-profile-table/garbage-station-profile-table.model';
// import { PagedTableAbstractComponent } from '../table-paged-abstract.component';
// import { MaintenanceProfileTableBusiness } from './maintenance-profile-table.business';
// import { MaintenanceProfileTableArgs } from './maintenance-profile-table.model';

// @Component({
//   selector: 'maintenance-profile-table',
//   templateUrl: './maintenance-profile-table.component.html',
//   styleUrls: ['./maintenance-profile-table.component.less'],
// })
// export class MaintenanceProfileTableComponent
//   extends PagedTableAbstractComponent<PartialData>
//   implements IComponent<IModel, PagedList<PartialData>>, OnInit, OnChanges
// {
//   @Input()
//   business: MaintenanceProfileTableBusiness;
//   @Input()
//   args: MaintenanceProfileTableArgs = new MaintenanceProfileTableArgs();

//   @Input()
//   load?: EventEmitter<MaintenanceProfileTableArgs>;

//   @Input()
//   selected?: PartialData;
//   @Output()
//   selectedChange: EventEmitter<PartialData> = new EventEmitter();
//   @Output()
//   loaded: EventEmitter<PagedList<IPartialData>> = new EventEmitter();
//   @Output()
//   check: EventEmitter<IPartialData> = new EventEmitter();
//   @Output()
//   itemclick: EventEmitter<ProfilePropertyValueModel> = new EventEmitter();

//   @Input()
//   toexcel?: EventEmitter<MaintenanceProfileTableArgs>;
//   @Output()
//   onexcel: EventEmitter<string> = new EventEmitter();

//   constructor(
//     business: MaintenanceProfileTableBusiness,
//     public source: GarbageStationProfilesSourceTools,
//     public language: GarbageStationProfilesLanguageTools
//   ) {
//     super();
//     this.business = business;
//   }

//   names: string[] = [
//     'ProfileName',
//     'Province',
//     'County',
//     'Street',
//     'Committee',
//     'ProfileState',
//   ];

//   properties: Property[] = [];

//   widths: string[] = [];

//   ngOnInit(): void {
//     this.loadData(1);
//     if (this.toexcel) {
//       this.toexcel.subscribe((args) => {
//         this.business.excel(args, this.names).then((x) => {
//           this.onexcel.emit(x);
//         });
//       });
//     }
//   }
//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['load']) {
//       if (this.load) {
//         this.load.subscribe((args) => {
//           this.args = args;
//           this.loadData(1, this.pageSize);
//         });
//       }
//     }
//   }

//   async loadData(index: number, size: number = this.pageSize) {
//     this.loading = true;
//     this.selected = undefined;

//     this.business.config.get(this.args.tableIds).then((names) => {
//       this.names = names;
//       this.business.load(index, size, this.names, this.args).then((paged) => {
//         this.page = paged.Page;
//         this.datas = paged.Data;
//         this.source.ProfileState;
//         this.loading = false;
//       });
//     });
//   }

//   sortData(sort: Sort) {
//     const isAsc = sort.direction === 'asc';
//     this.args.desc = undefined;
//     this.args.asc = undefined;
//     if (isAsc) {
//       this.args.asc = sort.active;
//     } else {
//       this.args.desc = sort.active;
//     }
//     this.loadData(1);
//   }

//   async onupdate(e: Event, item: PartialData) {
//     this.check.emit(item);
//     e.stopImmediatePropagation();
//   }

//   onselected(item: PartialData) {
//     if (this.selected === item) {
//       this.selected = undefined;
//     } else {
//       this.selected = item;
//     }

//     this.selectedChange.emit(this.selected);
//   }

//   async onitemclick(e: Event, item: PartialData, name: string) {
//     let value = await this.business.get(name, item[name]);
//     let model = {
//       profileId: item.Id,
//       model: value,
//     };
//     if (name.includes('Url') && value.Value) {
//       e.stopImmediatePropagation();

//       this.itemclick.emit(model);
//       return;
//     }
//     let property = await value.Property;
//     if (property) {
//       if (property.DataType === PropertyDataType.Object) {
//         e.stopImmediatePropagation();
//         this.itemclick.emit(model);
//       }
//     }
//   }
// }
