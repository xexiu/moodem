import React from "react";
import renderer from "react-test-renderer";
import { PreLoader } from '../common/PreLoader';

describe("PreLoader component", () => {
    it('has 1 childs', () => {
        const tree = renderer.create(<PreLoader />).toJSON();
        expect(tree.children.length).toBe(1);
    });
});