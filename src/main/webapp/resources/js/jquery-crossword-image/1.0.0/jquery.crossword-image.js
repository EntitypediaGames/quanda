/*jslint browser: true, unparam: true, todo: true, nomen: true */
/*global $, jQuery, alert, Raphael, _ */
/*global GF_RESOURCES_PATH */
/*
 * jquery.crossword-image. The jQuery plugin for drawing quanda
 *
 * Copyright (c) 2012 Homeria Open Solutions S.L.
 * http://www.homeria.com
 *
 * @author Javier Garcia
 * @author <a href="http://autayeu.com/">Aliaksandr Autayeu</a>
 */
(function ($) {
    "use strict";

    function drawLimits($this, clipRows, clipCols, opts) {
        var inc = 15,
            direction = 1,
            filledHeight = 0,
            filledWidth = 0,
            crossword = $this.data("crossword"),
            finalWidth = crossword.width,
            finalHeight = crossword.height,
            pathString = "",
            path;
        if (clipCols) {
            pathString = "M" + opts.width + ",0";
            while (filledHeight < opts.height + inc) {
                filledHeight += inc;
                pathString += "L" + parseInt(opts.width - inc * direction, 10) + "," + filledHeight;
                direction = direction === 1 ? 0 : 1;
            }
            pathString += "L" + opts.width + "," + opts.height + "Z";
            path = crossword.path(pathString);
            path.attr({
                fill: "#CCC"
            });
            finalWidth = opts.width;
        }
        if (clipRows) {
            pathString = "M0," + opts.height;
            while (filledWidth < opts.width + inc) {
                filledWidth += inc;
                pathString += "L" + filledWidth + "," + parseInt(opts.height - inc * direction, 10);
                direction = direction === 1 ? 0 : 1;
            }
            pathString += "L" + opts.width + "," + opts.height + "Z";
            path = $this.data("crossword").path(pathString);
            path.attr({
                fill: "#CCC"
            });
            finalHeight = opts.height;
        }
        crossword.setSize(finalWidth, finalHeight);
    }


    /***************************************************************************/
    /* LAYOUT EDITION AUX FUNCTIONS - MediaPlaceholder Edition  */
    /***************************************************************************/

    function SVGCellClickHandler(e) {
        $(this).trigger(e);
    }

    function labelClickHandler(e) {
        $(this.referenceCell).trigger(e);
    }

    function isPointInsideBBoxNoBorder(bbox, x, y) {
        return x >= bbox.x && x <= bbox.x2 - 1 && y >= bbox.y && y <= bbox.y2 - 1;
    }

    function isBBoxIntersectNoBorder(bbox1, bbox2) {
        var i = isPointInsideBBoxNoBorder;
        return i(bbox2, bbox1.x, bbox1.y) ||
            i(bbox2, bbox1.x2 - 1, bbox1.y) ||
            i(bbox2, bbox1.x, bbox1.y2 - 1) ||
            i(bbox2, bbox1.x2 - 1, bbox1.y2 - 1) ||
            i(bbox1, bbox2.x, bbox2.y) ||
            i(bbox1, bbox2.x2 - 1, bbox2.y) ||
            i(bbox1, bbox2.x, bbox2.y2 - 1) ||
            i(bbox1, bbox2.x2 - 1, bbox2.y2 - 1) ||
            (((bbox1.x < bbox2.x2 - 1 && bbox1.x > bbox2.x) || (bbox2.x < bbox1.x2 - 1 && bbox2.x > bbox1.x)) &&
            ((bbox1.y < bbox2.y2 - 1 && bbox1.y > bbox2.y) || (bbox2.y < bbox1.y2 - 1 && bbox2.y > bbox1.y)));
    }

    function getCellIndexOfPlaceholder(placeholder, opts) {
        var attrs = placeholder.subject.getBBox(),
            col = attrs.x / opts.boxWidth,
            row = attrs.y / opts.boxHeight;
        return Math.round(row * opts.numCols + col);
    }

    function cellIndexToOffset(cellIndex, opts) {
        var offset = {
                x: 0,
                y: 0
            },
            column = cellIndex % opts.numCols,
            thisRow = Math.floor(cellIndex / opts.numCols);
        offset.x = opts.borderSize + column * opts.boxWidth;
        offset.y = opts.borderSize + thisRow * opts.boxHeight;
        return offset;
    }

    function updateCellsOfMediaPlaceholder(cells, mediaPlaceholders) {
        var previousPhMediaValues = [],
            updatedCells = [];
        _(cells).each(function (cell, i) {
            previousPhMediaValues[i] = cell.phMedia;
            cell.phMedia = null;
        });
        _(mediaPlaceholders).each(function (mediaPlaceholder, i) {
            var bbox = mediaPlaceholder.getBBox(),
                phMedia = mediaPlaceholder.mediaPlaceholderId;
            _(cells).each(function (cell, i2) {
                if (isBBoxIntersectNoBorder(cell.cellElement.getBBox(), bbox)) {
                    cell.phMedia = phMedia;
                }
            });
        });
        updatedCells = _(cells).map(function (cell, i) {
            return previousPhMediaValues[i] !== cell.phMedia;
        });
        return updatedCells;
    }

    function resetPlaceholderEditorPosition(placeholder) { //placeholder is an object FreeTransformation
        placeholder.attrs = placeholder.subject.initialScalingAttrs;
        placeholder.apply();
    }

    function checkPlaceholderEditorInsidePaper(placeholder, paper) { //placeholder is an object FreeTransformation
        var placeholderBB = placeholder.subject.getBBox();
        if (Math.round(placeholderBB.x) < 0 ||
            Math.round(placeholderBB.x2) > paper.width ||
            Math.round(placeholderBB.y) < 0 ||
            Math.round(placeholderBB.y2) > paper.height) {
            return false;
        }
        return true;
    }

    function updateCellsStatusAndMediaPlaceholders(opts, mediaPlaceholders) {
        var updatedCells = updateCellsOfMediaPlaceholder(opts.cells, mediaPlaceholders);
        if (opts.callbackEdit !== null) {
            opts.callbackEdit(updatedCells);
        }
    }

    function selectPlaceholder(selectedPlaceholder, mediaPlaceholders) {
        var phMedia = selectedPlaceholder === null ? null : selectedPlaceholder.mediaPlaceholderId;
        _(mediaPlaceholders).each(function (d, i) {
            $(d.node).attr("class", "");
            $(_(_(_(d.freeTransform.handles.bbox).pluck("element")).pluck("node")).flatten())
                .css("display", d.mediaPlaceholderId === phMedia ? "block" : "none");
            $(d.freeTransform.handles.center.disc.node)
                .css("display", d.mediaPlaceholderId === phMedia ? "block" : "none");
        });
        if (selectedPlaceholder !== null) {
            $(selectedPlaceholder.node).attr("class", "selectedPlaceholder");
        }
    }

    function deletePlaceholder(placeholder, mediaPlaceholders, opts) {
        var mediaPlaceholderId = placeholder.mediaPlaceholderId;
        opts.mediaPlaceholders = _(mediaPlaceholders).without(placeholder);
        placeholder.freeTransform.hideHandles();
        placeholder.remove();
        updateCellsStatusAndMediaPlaceholders(opts, opts.mediaPlaceholders);
        opts.callbackDeleteMedia(mediaPlaceholderId);
        return opts.mediaPlaceholders;
    }

    function deleteSelectedPlaceholder(opts) {
        var placeholder = null;
        placeholder = _(opts.mediaPlaceholders).find(function (d, i) {
            return $(d.node).attr("class") === "selectedPlaceholder";
        });
        if (placeholder !== null) {
            deletePlaceholder(placeholder, opts.mediaPlaceholders, opts);
        }
        return opts.mediaPlaceholders;
    }

    function createMediaPlaceholder(crosswordElem, mediaProperties) {
        var opts = crosswordElem.data("options"),
            crossword = crosswordElem.data("crossword"),
            cloned = crossword.rect(0, 0, mediaProperties.width, mediaProperties.height),
            ft;
        cloned.show();
        cloned.attr({
            fill: "#999"
        });

        cloned.transform("T" +
        (mediaProperties.x - mediaProperties.width / 2 + mediaProperties.width * mediaProperties.scaleX / 2) + "," +
        (mediaProperties.y - mediaProperties.height / 2 + mediaProperties.height * mediaProperties.scaleY / 2) +
        "S" + mediaProperties.scaleX + "," + mediaProperties.scaleY);
        cloned.mediaPlaceholderId = mediaProperties.id;
        opts.mediaPlaceholders.push(cloned);
        if (!opts.layoutEditorMode) {
            ft = crossword.freeTransform(cloned);
            ft.setOpts({
                rotate: false,
                removeButton: false,
                backgroundImage: GF_RESOURCES_PATH + "images/is_media_clue.svg",
                drag: [],
                scale: [],
                keepRatio: [],
                draw: ['bbox'],
                range: {
                    scale: [opts.boxWidth, opts.boxWidth * Math.max(opts.numCols, opts.numRows)]
                }
            });

        } else {
            $(cloned).click(function (e) {
                selectPlaceholder(this, opts.mediaPlaceholders);
                updateCellsStatusAndMediaPlaceholders(opts, opts.mediaPlaceholders);
            });
            cloned.click(SVGCellClickHandler);
            ft = crossword.freeTransform(cloned);
            ft.setOpts({
                    rotate: false,
                    removeButton: true,
                    backgroundImage: GF_RESOURCES_PATH + "images/is_media_clue.svg",
                    drag: ['center'],
                    scale: ['bboxSides'],
                    callbackRemove: function (obj) {
                        deletePlaceholder(obj.subject, opts.mediaPlaceholders, opts);
                    },
                    keepRatio: ['bboxSides'],
                    forceNoKeepRatio: true,
                    draw: ['bbox'],
                    snap: {
                        rotate: 0,
                        scale: opts.boxWidth,
                        drag: opts.boxWidth
                    },
                    range: {
                        scale: [opts.boxWidth, opts.boxWidth * Math.max(opts.numCols, opts.numRows)]
                    },
                    snapDist: {
                        rotate: 0,
                        scale: 100000000,
                        drag: 100000
                    }
                },
                function (obj, events) { //event handler
                    var endEvents = $.grep(events, function (d, i) {
                            return d === "scale end" || d === "drag end";
                        }),
                        startEvents = $.grep(events, function (d, i) {
                            return d === "scale start" || d === "drag start";
                        }),
                        objBB,
                        collisions;
                    if (startEvents.length > 0) {
                        obj.subject.initialScalingAttrs = jQuery.extend(true, {}, obj.attrs);
                        $(obj.subject.node).css("opacity", 0.75);
                    }
                    if (endEvents.length > 0) {
                        $(obj.subject.node).css("opacity", 1);
                        objBB = obj.subject.getBBox();
                        collisions = $.grep(opts.mediaPlaceholders, function (d, i) {
                            if (obj.subject !== d && isBBoxIntersectNoBorder(objBB, d.getBBox())) {
                                return true;
                            }
                            return false;
                        });
                        if (collisions.length > 0 || !checkPlaceholderEditorInsidePaper(obj, crossword)) {
                            resetPlaceholderEditorPosition(obj);
                        } else { //callback with new status of cells
                            updateCellsStatusAndMediaPlaceholders(opts, opts.mediaPlaceholders);
                            opts.callbackUpdateMedia(getCellIndexOfPlaceholder(obj, opts), obj.attrs.scale.x, obj.attrs.scale.y, obj.subject.mediaPlaceholderId);
                        }
                    }
                }
            );
            $(_(_(_(ft.handles.bbox).pluck("element")).pluck("node")).flatten()).attr("class", function (i, d) {
                return i % 2 === 0 ? "placeholderHandle verticalHandle" : "placeholderHandle horizontalHandle";
            });
            $(ft.handles.center.disc.node).attr("class", "placeholderCenterHandle");
            updateCellsStatusAndMediaPlaceholders(opts, opts.mediaPlaceholders);
            selectPlaceholder(cloned, opts.mediaPlaceholders);
        }
        return cloned;
    }

    function SVGCellJqClickHandler(e) {
        var candidateIndex = this.cellIndex,
            crosswordElem = $(this.paper.canvas).parent(),
            opts = crosswordElem.data("options"),
            sortedCells = opts.sortedCells,
            createdMedia,
            candidateCell;

        if (!e.shiftKey) {  //no shiftkey
            if (opts.callback !== null) {
                opts.callback(candidateIndex);
            }
            candidateCell = sortedCells[candidateIndex];
            if (candidateCell === undefined) {
                return;
            }
            if (opts.selectable && (opts.blackIsSelectable || candidateCell.white)) {
                opts.selectedCellIdx = candidateIndex;
                crosswordElem.crosswordImage("drawCells");
            }
        } else {//shiftkey -> media placeholder
            if (opts.layoutEditorMode) {
                createdMedia = createMediaPlaceholder(crosswordElem, {
                    x: this.attrs.x,
                    y: this.attrs.y,
                    height: opts.boxHeight,
                    width: opts.boxWidth,
                    scaleX: 1,
                    scaleY: 1,
                    id: "ph" + opts.mediaPlaceholders.length + new Date().getTime()
                });
                opts.callbackCreateMedia(this.cellIndex, 1, 1, createdMedia);
            }
        }
    }

    /************* PLACEHOLDER WITH IMAGE FUNCTIONS *************/
    function createMediaLabel(crosswordElem, placeholderElement, isAcross, clueNo) {
        var crossword = crosswordElem.data("crossword"),
            opts = crosswordElem.data("options"),
            clueOffset = opts.clueOffset,
            clueSize = opts.clueSize,
            arrowChar = isAcross ? ' \u25B6' : ' \u25BC',
            labelClueNo = crossword.text(
                placeholderElement.getBBox().x + clueOffset * 2,
                placeholderElement.getBBox().y + clueSize / 2 + clueOffset * 2,
                clueNo + arrowChar
            ),
            SVGRect,
            labelBackground;
        labelClueNo.attr({
            "font-size": clueSize + "px",
            "text-anchor": "start"
        });
        labelClueNo.imageElement = placeholderElement;
        $(labelClueNo.node).attr("class", "mediaLabel");
        SVGRect = labelClueNo.getBBox();

        labelBackground = crossword.rect(SVGRect.x - clueOffset, SVGRect.y - clueOffset, SVGRect.width + clueOffset * 2, SVGRect.height + clueOffset * 2);
        labelBackground.attr({
            fill: "#F0F0F0",
            "stroke-width": 0
        });
        $(labelBackground.node).attr("class", "mediaLabelBackground");
        labelClueNo.labelBackground = labelBackground;
        labelClueNo.toFront();
        if (opts.crosswordEditorMode) {
            var ox = 0,
                oy = 0,
                lx = 0,
                ly = 0;
            labelClueNo.drag(
                function (dx, dy, x, y, event) {
                    lx = dx + ox;
                    ly = dy + oy;
                    labelClueNo.transform('t' + lx + ',' + ly);
                    labelClueNo.labelBackground.transform('t' + lx + ',' + ly);
                    labelClueNo.ghostImage.transform('t' + lx + ',' + ly);
                    var dropBbox = _(opts.mediaPlaceholders).find(function (d) {
                        return isPointInsideBBoxNoBorder(d.getBBox(), labelClueNo.attr("x") + lx, labelClueNo.attr("y") + ly);
                    });
                    if (dropBbox !== undefined) {
                        labelClueNo.ghostImage.attr("opacity", 0.9);
                        $(labelClueNo.node).attr("class", "mediaLabel allowDrop");
                        $(labelClueNo.ghostImage.node).attr("class", "mediaLabel allowDrop");
                    } else {
                        labelClueNo.ghostImage.attr("opacity", 0.25);
                        $(labelClueNo.node).attr("class", "mediaLabel denyDrop");
                        $(labelClueNo.ghostImage.node).attr("class", "mediaLabel denyDrop");
                    }
                },
                function (dx, dy) {
                    labelClueNo.labelBackground.toFront();
                    labelClueNo.toFront();
                    labelClueNo.ghostImage = labelClueNo.imageElement.clone();
                    labelClueNo.ghostImage.attr({
                        opacity: 0.25,
                        x: labelClueNo.attr("x"),
                        y: labelClueNo.attr("y")
                    });
                    labelClueNo.ghostImage.attr("opacity", 0.9);
                    $(labelClueNo.node).attr("class", "mediaLabel allowDrop");
                    $(labelClueNo.ghostImage.node).attr("class", "mediaLabel allowDrop");
                },
                function (dx, dy) {
                    var clue,
                        dropBbox;
                    labelClueNo.ghostImage.remove();
                    labelClueNo.transform('t' + ox + ',' + oy);
                    labelClueNo.labelBackground.transform('t' + ox + ',' + oy);
                    $(labelClueNo.node).attr("class", "mediaLabel");

                    //CHECK IF IT IS DROPPED INSIDE ANOTHER IMAGE
                    dropBbox = _(opts.mediaPlaceholders).find(function (d) {
                        return isPointInsideBBoxNoBorder(d.getBBox(), labelClueNo.attr("x") + lx, labelClueNo.attr("y") + ly);
                    });
                    if (dropBbox !== undefined) {
                        if (dropBbox.mediaPlaceholderId !== labelClueNo.imageElement.mediaPlaceholder.layoutMedia.id) {
                            clue = labelClueNo.imageElement.mediaPlaceholder.crosswordClue;
                            opts.callbackUpdateMediaClue(clue.clueNo, clue.across, dropBbox.mediaPlaceholderId);
                        }
                    }
                }
            );
        }
        return labelClueNo;
    }

    function createImageInMediaPlaceholder(crosswordElem, mediaProperties, media) {
        var crossword = crosswordElem.data("crossword"),
            opts = crosswordElem.data("options"),
            element = crossword.image(media.crosswordClue.wordClue.imgUrl,
                mediaProperties.x, mediaProperties.y,
                mediaProperties.width * mediaProperties.scaleX,
                mediaProperties.height * mediaProperties.scaleY),
            placeholder;
        //preserve image aspect ratio and center it
        $(element.node).prop('preserveAspectRatio').baseVal.align = 6;
        $(element.node).prop('preserveAspectRatio').baseVal.meetOrSlice = 1;

        element.show();
        $(element.node).attr("class", "imageMediaPlaceholder dropable");
        element.click(function (evt) {
            $.fancybox.open([{
                href: this.attr("src")
            }]);
        });
        element.mediaPlaceholder = media;
        element.mediaLabel = createMediaLabel(crosswordElem, element, media.crosswordClue.across, media.crosswordClue.clueNo);
        media.raphaelElement = element;

        //hide media background image
        placeholder = _(opts.mediaPlaceholders).find(function (d) {
            return d.mediaPlaceholderId === media.layoutMedia.id;
        });
        placeholder.freeTransform.handles.backgroundImage.attr({opacity: 0});
        return element;
    }

    function generateMediaPropertiesFromCell(cell, opts) {
        var offset = cellIndexToOffset(cell.cellNo, opts);
        return {
            x: offset.x,
            y: offset.y,
            scaleX: cell.width,
            scaleY: cell.height,
            width: opts.boxWidth,
            height: opts.boxHeight
        };
    }


    /**************************************/
    /*** Crossword Image public methods ***/
    /**************************************/
    var methods = {
        init: function (options) {
            var opts = $.extend({}, $.fn.crosswordImage.defaults, options),
                width = opts.width,
                height = opts.height,
                numCols = opts.numCols,
                numRows = opts.numRows,
                clipRows = false,
                clipCols = false,
                hBorderSize = opts.borderSize,
                vBorderSize = opts.borderSize,
                boxPadding = opts.boxPadding,
                boxWidth,
                boxHeight,
                clueSize,
                sortedCells,
                crossword;

            if (opts.clipContent) {

                numRows = Math.min(opts.numRows, opts.maxShownRows);
                numCols = Math.min(opts.numCols, opts.maxShownRows);

                if (numRows !== numCols) {
                    if (numRows > numCols) {
                        width = width * (numCols / numRows);
                    } else {
                        height = height * (numRows / numCols);
                    }
                }

                if (numRows < opts.numRows) {
                    clipRows = true;
                }
                if (numCols < opts.numCols) {
                    clipCols = true;
                }
            }

            boxWidth = Math.round((width - (numCols + 3) * boxPadding) / numCols);
            boxHeight = Math.round((height - (numRows + 3) * boxPadding) / numRows);
            clueSize = boxWidth * opts.clueSizePercentage;

            if ((boxWidth * numCols) + (numCols - 1) * boxPadding < width) {
                hBorderSize = Math.round((width - ((boxWidth * numCols) + (numCols - 1) * boxPadding)) / 2);
            }
            if ((boxHeight * numRows) + (numRows - 1) * boxPadding < height) {
                vBorderSize = Math.round((height - ((boxHeight * numRows) + (numRows - 1) * boxPadding)) / 2);
            }


            sortedCells = $(opts.cells).sort(function (a, b) {
                if (a.cellNo === b.cellNo) {
                    return 0;
                }
                return a.cellNo > b.cellNo ? 1 : -1;
            });

            // opts.numCols = numCols;
            // opts.numRows = numRows;
            opts.hborderSize = hBorderSize;
            opts.vborderSize = vBorderSize;
            opts.sortedCells = sortedCells;
            opts.boxWidth = boxWidth;
            opts.boxHeight = boxHeight;
            opts.boxPadding = boxPadding;
            opts.clueSize = clueSize;
            $(this).data("options", opts);


            $(this).addClass("crosswordImageElement");
            $(this).toggleClass("crosswordEditorMode", opts.crosswordEditorMode);
            if ($(this).attr("id") === undefined) {
                $(this).attr("id", "crosswordId" + new Date().getTime());
            }
            crossword = new Raphael($(this).attr("id"), opts.width, opts.height);
            $(this).data("crossword", crossword);
            $(this).crosswordImage("createCells");
            $(this).crosswordImage("createMedia");
            if (opts.showLimits === true) {
                drawLimits($(this), clipRows, clipCols, opts);
            }
        },
        createMedia: function () {
            var opts = $(this).data("options"),
                crossword = $(this);
            _(opts.media).each(function (d) {
                var mediaProperties = generateMediaPropertiesFromCell(d, opts);
                mediaProperties.id = d.id;
                createMediaPlaceholder(crossword, mediaProperties);
            });
            _(opts.mediaImages).each(function (d) {
                if (d.crosswordClue !== null && d.crosswordClue !== undefined) {
                    if (d.crosswordClue.wordClue !== null && d.crosswordClue.wordClue !== undefined) {
                        if (d.crosswordClue.wordClue.imgUrl !== null && d.crosswordClue.wordClue.imgUrl !== undefined) {
                            var mediaProperties = generateMediaPropertiesFromCell(d.layoutMedia, opts);
                            createImageInMediaPlaceholder(crossword, mediaProperties, d);
                        }
                    }
                }
            });
        },

        addMediaImage: function (mediaImage) {
            var opts = $(this).data("options"),
                crossword = $(this),
                mediaProperties;
            if (mediaImage.crosswordClue !== null && mediaImage.crosswordClue !== undefined) {
                if (mediaImage.crosswordClue.wordClue !== null && mediaImage.crosswordClue.wordClue !== undefined) {
                    if (mediaImage.crosswordClue.wordClue.imgUrl !== null && mediaImage.crosswordClue.wordClue.imgUrl !== undefined) {
                        mediaProperties = generateMediaPropertiesFromCell(mediaImage.layoutMedia, opts);
                        createImageInMediaPlaceholder(crossword, mediaProperties, mediaImage);
                        opts.mediaImages.push(mediaImage);
                    }
                }
            }
        },
        removeMediaImage: function (mediaImage) {
            var opts = $(this).data("options"),
                deletedIndex,
                placeholder;

            mediaImage.raphaelElement.mediaLabel.labelBackground.remove();
            mediaImage.raphaelElement.mediaLabel.remove();
            mediaImage.raphaelElement.remove();
            deletedIndex = _(opts.mediaImages).indexOf(mediaImage);
            opts.mediaImages.splice(deletedIndex, 1);
            //show media background image
            placeholder = _(opts.mediaPlaceholders).find(function (d) {
                return d.mediaPlaceholderId === mediaImage.layoutMedia.id;
            });
            placeholder.freeTransform.handles.backgroundImage.attr({opacity: 1});
        },

        createCells: function () {
            var opts = $(this).data("options"),
                crossword = $(this).data("crossword"),
                numCols = opts.numCols,
                numRows = opts.numRows,
                clueOffset = opts.clueOffset,
                sortedCells = opts.sortedCells,
                hBorderSize = opts.borderSize,
                vBorderSize = opts.borderSize,
                boxWidth = opts.boxWidth,
                boxHeight = opts.boxHeight,
                emptyColor = opts.emptyColor,
                isStaticCrossword = opts.isStaticCrossword,
                backgroundColor = opts.backgroundColor,
                clueSize = opts.clueSize,
                i,
                j,
                index,
                val,
                cellColor,
                SVGCell,
                text,
                label,
                offset,
                x,
                y;

            var visibleCols = Math.ceil(crossword.width / boxWidth);
            var visibleRows = Math.ceil(crossword.height / boxHeight);
            crossword.clear();
            crossword.setSize(Math.min(visibleCols, numCols) * boxWidth + hBorderSize * 2, Math.min(visibleRows, numRows) * boxHeight + vBorderSize * 2);
            index = 0;
            opts.mediaPlaceholders = [];

            
            for (i = 0; i < numRows; i = i + 1) {
                for (j = 0; j < numCols; j = j + 1) {
                    if (i >= visibleRows || j >= visibleCols) {
                        index = index + 1;
                        continue;
                    }
                    val = sortedCells[index];
                    if (val === null) {
                        val = {};
                        val.cellNo = index;
                        val.white = false;
                        val.phMedia = null;
                    }
                    if (opts.selectedCellIdx === i) {
                        cellColor = val.white ? opts.selectedColor : opts.selectedBackgroundColor;
                    } else {
                        if (val.alternativeColor !== null && val.alternativeColor !== undefined) {
                            cellColor = val.alternativeColor;
                        } else {
                            cellColor = val.white ? emptyColor : backgroundColor;
                        }
                    }
                    offset = cellIndexToOffset(index, opts);
                    x = offset.x;
                    y = offset.y;

                    /** raphael**/
                    SVGCell = crossword.rect(x, y, boxWidth, boxHeight);
                    SVGCell.attr({fill: cellColor});
                    if (!isStaticCrossword) {
                        SVGCell.cellIndex = index;
                        $(SVGCell).click(SVGCellJqClickHandler);
                        SVGCell.click(SVGCellClickHandler);
                    }

                    if (opts.showClues === true) {
                        if (val.clueNo === null || val.clueNo === undefined) {
                            text = " ";
                        } else {
                            text = val.clueNo;
                        }
                        if (!isStaticCrossword || text !== " ") {
                            //Hack for RaphaelJs, it seems that changing the content of a Text makes a 
                            // (wrong) transformation on the position, initializing with a letter (not a space) solves the problem...
                            label = crossword.text(x + clueOffset, y + clueSize / 2 + clueOffset, "W");
                            label.referenceCell = SVGCell;
                            SVGCell.clueElement = label;
                            label.click(labelClickHandler);
                           
                            label.attr({
                                "font-size": clueSize + "px",
                                "text-anchor": "start",
                                "text" : text
                            });
                        }
                        
                    }
                    if (opts.showLetters === true) {
                        if (val.letter === null || val.letter === undefined) {
                            text = " ";
                        } else {
                            text = String(val.letter).toUpperCase();
                        }
                        if (!isStaticCrossword || text !== " ") {
                            label = crossword.text(x + boxWidth / 2, y + boxHeight / 2, "W");
                            label.attr({
                                "font-size": boxWidth * 0.7 + "px"
                            });
                            label.attr("text", text);
                            label.referenceCell = SVGCell;
                            label.click(labelClickHandler);
                            label.isLetter = true;
                        }
                        SVGCell.letterElement = label;
                    }
                    val.cellElement = SVGCell;
                    index = index + 1;
                }
            }
        },
        drawCells: function () {
            var opts = $(this).data("options"),
                sortedCells = opts.sortedCells,
                emptyColor = opts.emptyColor,
                backgroundColor = opts.backgroundColor,
                cellColor,
                letterColor,
                SVGcell,
                text;

            $.each(sortedCells, function (i, val) {
                if (val === null) {
                    val.cellNo = i;
                    val.white = false;
                }
                SVGcell = val.cellElement;

                if (SVGcell.clueElement !== undefined && opts.showClues) {
                    text = val.clueNo === null ? " " : val.clueNo;
                    if (SVGcell.clueElement.attr("text") !== text) {
                        SVGcell.clueElement.attr("text", text);
                    }
                }
                if (val.white) {
                    if (SVGcell.letterElement !== undefined && opts.showLetters) {
                        text = val.letter === null || val.letter === undefined ? " " : String(val.letter).toUpperCase();
                        if (SVGcell.letterElement.attr("text") !== text) {
                            SVGcell.letterElement.attr({
                                "text": text
                            });
                        }
                        letterColor = (val.mask !== null && val.mask) ? opts.maskLetterColor : backgroundColor;
                        if (SVGcell.letterElement.attr("opacity") !== letterColor) {
                            SVGcell.letterElement.attr("fill", letterColor);
                        }
                    }
                }
                cellColor = val.white ? emptyColor : backgroundColor;
                if (val.alternativeColor !== null && val.alternativeColor !== undefined) {
                    cellColor = val.alternativeColor;
                }
                if (opts.selectedCellIdx === i) {
                    cellColor = val.white ? opts.selectedColor : opts.selectedBackgroundColor;
                }
                if (SVGcell.attr("fill") !== cellColor) {
                    SVGcell.attr("fill", cellColor);
                }
            });
        },
        removeSelectedPlaceholder: function () {
            var opts = $(this).data("options");
            deleteSelectedPlaceholder(opts);
        },
        unselectPlaceholder: function () {
            var opts = $(this).data("options");
            selectPlaceholder(null, opts.mediaPlaceholders);
        },
        changeSelected: function (newIndex) {
            var options = $(this).data("options");
            options.selectedCellIdx = newIndex;
            $(this).data("options", options);
        }
    };

    $.fn.crosswordImage = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        }
        $.error('Method ' + methodOrOptions + ' does not exist on jQuery.crosswordImage');
    };

    $.fn.crosswordImage.defaults = {
        backgroundColor: "#222222",
        blackIsSelectable: true,
        boxPadding: 0,
        borderSize: 0,
        callback: null,
        // returns (index, width, height, opts)
        callbackCreateMedia: null,
        // returns (index, width, height, mediaId)
        callbackUpdateMedia: null,
        // returns (mediaId)
        callbackDeleteMedia: null,
        callbackEdit: null,
        cells: null,
        clipContent: true,
        //static quanda will not be modified after they are displayed -> improves performance
        isStaticCrossword: false,
        clueOffset: 2,
        clueColor: "#666666",
        clueSizePercentage: 0.3,
        layoutEditorMode: false,
        crosswordEditorMode: false,
        emptyColor: "#FEFEFE",
        height: 120,
        inputElement: null,
        maskLetterColor: "#A2A2A2",
        maxShownRows: 30,
        media: [],
        mediaImages: [],
        numCols: 7,
        numRows: 7,
        selectable: false,
        selectedCellIdx: -1,
        selectedColor: "#f5ee80",
        selectedBackgroundColor: "#918d49",
        showClues: true,
        showLetters: true,
        showLimits: true,
        sizeColor: "#0000DD",
        sizeSize: 30,
        callbackUpdateMediaClue: null,
        width: 120
    };

}(jQuery));