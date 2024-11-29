type EventParameter<E extends Event, T extends EventTarget> = E & {
	currentTarget: EventTarget & T;
};
