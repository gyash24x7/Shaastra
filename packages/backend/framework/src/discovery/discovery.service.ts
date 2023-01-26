import { Injectable, Scope, Type } from "@nestjs/common";
import { MetadataScanner, ModulesContainer } from "@nestjs/core";
import { STATIC_CONTEXT } from "@nestjs/core/injector/constants.js";
import type { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper.js";
import type { Module } from "@nestjs/core/injector/module.js";
import "reflect-metadata";
import type {
	DiscoveredClass,
	DiscoveredClassWithMeta,
	DiscoveredMethodWithMeta,
	Filter,
	MetaKey,
	DiscoveredMethod
} from "./discovery.interfaces.js";

export function getComponentMetaAtKey<T>( key: MetaKey, component: DiscoveredClass ): T | undefined {
	const dependencyMeta = Reflect.getMetadata( key, component.dependencyType ) as T;
	if ( dependencyMeta ) {
		return dependencyMeta;
	}

	if ( component.injectType != null ) {
		return Reflect.getMetadata( key, component.injectType ) as T;
	}

	return undefined;
}

export function withMetaAtKey( key: MetaKey ): Filter<DiscoveredClass> {
	return component => [ component.instance?.constructor, component.injectType as Function ]
		.filter( x => x != null )
		.some( x => Reflect.getMetadata( key, x ) );
}

@Injectable()
export class DiscoveryService {

	constructor(
		private readonly modulesContainer: ModulesContainer,
		private readonly metadataScanner: MetadataScanner
	) {}

	async providersWithMetaAtKey<T>( metaKey: MetaKey ): Promise<DiscoveredClassWithMeta<T>[]> {
		const providers = await this.discoverProviders( withMetaAtKey( metaKey ) );

		return providers.map( x => (
			{
				meta: getComponentMetaAtKey<T>( metaKey, x ) as T,
				discoveredClass: x
			}
		) );
	}

	classMethodsWithMetaAtKey<T>( component: DiscoveredClass, metaKey: MetaKey ): DiscoveredMethodWithMeta<T>[] {
		const { instance } = component;

		if ( !instance ) {
			return [];
		}

		const prototype = Object.getPrototypeOf( instance );

		return this.metadataScanner
			.scanFromPrototype( instance, prototype, ( name ) =>
				this.extractMethodMetaAtKey<T>( metaKey, component, prototype, name )
			)
			.filter( x => !!x.meta );
	}

	getMetaAtKey<T>( metaKey: MetaKey, method: DiscoveredMethod ): T | undefined {
		return Reflect.getMetadata( metaKey, method.handler );
	}

	private readonly defaultFilter = () => true;

	private async toDiscoveredClass( nestModule: Module, wrapper: InstanceWrapper ): Promise<DiscoveredClass> {
		const instanceHost = wrapper.getInstanceByContextId( STATIC_CONTEXT, wrapper.id );

		if ( instanceHost.isPending && !instanceHost.isResolved ) {
			await instanceHost.donePromise;
		}

		return {
			name: wrapper.name as string,
			instance: instanceHost.instance,
			injectType: wrapper.metatype,
			dependencyType: instanceHost.instance?.constructor,
			parentModule: {
				name: nestModule.metatype.name,
				instance: nestModule.instance,
				injectType: nestModule.metatype,
				dependencyType: nestModule.instance.constructor as Type<object>
			}
		};
	}

	private extractMethodMetaAtKey<T>(
		metaKey: MetaKey,
		parentClass: DiscoveredClass,
		prototype: any,
		methodName: string
	): DiscoveredMethodWithMeta<T> {
		const handler = prototype[ methodName ];
		const meta: T = Reflect.getMetadata( metaKey, handler );
		return { meta, discoveredMethod: { handler, methodName, parentClass } };
	}

	private async discoverProviders( filter?: Filter<DiscoveredClass> ) {
		const providers = await Promise.all( Array.from( this.modulesContainer.values() )
			.flatMap( module => Array.from( module.providers.values() )
				.filter( component => component.scope !== Scope.REQUEST )
				.map( component => this.toDiscoveredClass( module, component ) )
			)
		);

		return providers.filter( filter ?? this.defaultFilter );
	}
}